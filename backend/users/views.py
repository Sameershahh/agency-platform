from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer, ContactMessageSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import get_user_model, authenticate
from django.shortcuts import redirect
from django.conf import settings
from django.http import JsonResponse, HttpResponseRedirect  
from django.utils import timezone
from .utils import verify_email_token, send_verification_email, generate_password_reset_token, verify_password_reset_token
from django.core.mail import send_mail
from .models import ContactMessage
from django.utils.crypto import get_random_string

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # pass request explicitly into serializer context so send_verification_email can build absolute URIs
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "User registered. Please check your email for verification link."}, status=status.HTTP_201_CREATED) 


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")

        if not email or not code:
            return Response(
                {"detail": "Email and 6-digit code are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "No user found with this email."},
                status=status.HTTP_404_NOT_FOUND
            )

        # check code validity and expiry
        if (
            user.email_verification_code != code
            or not user.email_verification_expiry
            or user.email_verification_expiry < timezone.now()
        ):
            return Response(
                {"detail": "Invalid or expired verification code."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # mark verified
        user.is_email_verified = True
        user.is_active = True
        user.email_verification_code = None
        user.email_verification_expiry = None
        user.save(update_fields=[
            "is_email_verified",
            "is_active",
            "email_verification_code",
            "email_verification_expiry",
        ])

        return Response(
            {"message": "Email verified successfully."},
            status=status.HTTP_200_OK
        )

# Google id_token auth view
class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        id_token = request.data.get("id_token")
        if not id_token:
            return Response({"detail": "Missing id_token"}, status=status.HTTP_400_BAD_REQUEST)

        # verify using google-auth
        from google.oauth2 import id_token as google_id_token
        from google.auth.transport import requests as google_requests

        try:
            info = google_id_token.verify_oauth2_token(id_token, google_requests.Request(), None)
        except Exception as e:
            return Response({"detail": "Invalid id_token", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        email = info.get("email")
        full_name = info.get("name") or ""
        email_verified_by_google = info.get("email_verified", False)

        if not email:
            return Response({"detail": "Google token did not contain an email"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(email=email, defaults={
            "full_name": full_name or email.split("@")[0],
            "is_active": True,
            "is_email_verified": bool(email_verified_by_google),
        })

        # If user existed but was not marked verified and Google reports verified, update
        if not user.is_email_verified and email_verified_by_google:
            user.is_email_verified = True
            user.is_active = True
            user.save()

        # If created and email wasn't verified by Google, still mark user inactive and send verification
        if created and not email_verified_by_google:
            user.is_active = False
            user.is_email_verified = False
            user.save()
            # send verification email
            send_verification_email(user, request)

            return Response({
                "detail": "Account created. A verification email has been sent to your address."
            }, status=status.HTTP_201_CREATED)

        # generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        })  

def email_verified(request):
    return JsonResponse({"message": "Email verified! You can now log in."})

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            })
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
    })

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "No user found with this email."},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.is_email_verified:
            return Response(
                {"detail": "Email already verified."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Reuse your new utility function — it now sends a 6-digit code
        send_verification_email(user, request)
        return Response(
            {"message": "Verification code resent to your email."},
            status=status.HTTP_200_OK
        )



class LogoutView(APIView):
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]
    permission_classes = [permissions.AllowAny]  # for browser testing

    def get(self, request):
        return Response(
            {"message": "Logout endpoint is ready. Use POST with refresh token."},
            status=status.HTTP_200_OK
        )

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception:
            return Response(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )


class PasswordResetRequestView(APIView):
    """
    POST /api/password-reset-request/
    Generates password reset token and sends email with reset link and 6-digit code.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {"error": "Email is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email=email).first()
        if not user:
            # Security: Don't reveal if user exists (prevents email enumeration)
            return Response(
                {"message": "If an account exists with this email, you will receive password reset instructions."},
                status=status.HTTP_200_OK
            )

        # Generate JWT-like reset token for link-based reset
        token = generate_password_reset_token(user)

        # Generate optional 6-digit code for manual reset flow
        code = get_random_string(length=6, allowed_chars='0123456789')
        user.password_reset_code = code
        user.password_reset_expiry = timezone.now() + timezone.timedelta(minutes=15)
        user.save(update_fields=['password_reset_code', 'password_reset_expiry'])

        # Build reset link using backend URL
        reset_link = f"{settings.BACKEND_URL.rstrip('/')}/api/password-reset-redirect/{token}/"

        # Send email with both code and link
        try:
            send_mail(
                subject="Password Reset Request",
                message=(
                    f"Hello,\n\n"
                    f"You requested to reset your password.\n\n"
                    f"Your password reset code is: {code}\n"
                    f"This code will expire in 15 minutes.\n\n"
                    f"Alternatively, click the link below to reset via browser:\n{reset_link}\n\n"
                    f"If you didn't request this, please ignore this email.\n"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            # Log error but don't expose to user
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send password reset email: {str(e)}")
            
            return Response(
                {"error": "Failed to send email. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"message": "If an account exists with this email, you will receive password reset instructions."},
            status=status.HTTP_200_OK
        )


class PasswordResetRedirectView(APIView):
    """
    GET /api/password-reset-redirect/<token>/
    Verifies token, sets a short-lived HttpOnly cookie and redirects to frontend.
    """
    permission_classes = [AllowAny]

    def get(self, request, token):
        # Verify token validity
        data = verify_password_reset_token(token)
        
        # Determine frontend URL based on environment
        frontend_url = "http://localhost:3000" if settings.DEBUG else settings.FRONTEND_URL
        
        if not data:
            redirect_url = f"{frontend_url.rstrip('/')}/reset-password-invalid"
            return HttpResponseRedirect(redirect_url)

        redirect_url = f"{frontend_url.rstrip('/')}/reset-password"
        response = HttpResponseRedirect(redirect_url)

        max_age = getattr(settings, "PASSWORD_RESET_COOKIE_AGE", 60 * 15)
        cookie_name = getattr(settings, "PASSWORD_RESET_COOKIE_NAME", "password_reset")

        if settings.DEBUG:
            # Development: Lax + not secure (works with HTTP localhost)
            cookie_args = {
                "max_age": max_age,
                "httponly": True,
                "secure": False,
                "samesite": "Lax",
                "path": "/",
            }
        else:
            # Production: None + secure (works with HTTPS cross-origin)
            cookie_args = {
                "max_age": max_age,
                "httponly": True,
                "secure": True,
                "samesite": "None",
                "path": "/",
            }
            cookie_domain = getattr(settings, "PASSWORD_RESET_COOKIE_DOMAIN", None)
            if cookie_domain:
                cookie_args["domain"] = cookie_domain

        response.set_cookie(cookie_name, token, **cookie_args)
        return response


class PasswordResetConfirmView(APIView):
    """
    POST /api/password-reset-confirm/
    Accepts new password and reads token from HttpOnly cookie.
    Falls back to body token for backward compatibility.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        cookie_name = getattr(settings, "PASSWORD_RESET_COOKIE_NAME", "password_reset")
        token = request.COOKIES.get(cookie_name)

        if not token:
            token = request.data.get("token")

        new_password = request.data.get("new_password")

        if not token or not new_password:
            return Response(
                {"detail": "Token and new password are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        data = verify_password_reset_token(token)
        if not data:
            return Response(
                {"detail": "Invalid or expired token."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=data.get("user_id"))
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        user.set_password(new_password)
        user.password_reset_code = None
        user.password_reset_expiry = None
        user.save(update_fields=['password', 'password_reset_code', 'password_reset_expiry'])

        response = Response(
            {"message": "Password has been reset successfully."}, 
            status=status.HTTP_200_OK
        )

        if settings.DEBUG:
            response.delete_cookie(cookie_name, path="/", samesite="Lax")
        else:
            delete_kwargs = {"path": "/", "samesite": "None", "secure": True}
            cookie_domain = getattr(settings, "PASSWORD_RESET_COOKIE_DOMAIN", None)
            if cookie_domain:
                delete_kwargs["domain"] = cookie_domain
            response.delete_cookie(cookie_name, **delete_kwargs)

        return response

class IsAdminUser(permissions.BasePermission):
    """Allow access only to admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class ContactMessageView(generics.ListCreateAPIView):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        contact = serializer.save()

        # Send email to admin
        send_mail(
            subject=f"New Contact Message from {contact.name}",
            message=(
                f"Name: {contact.name}\n"
                f"Email: {contact.email}\n\n"
                f"Message:\n{contact.message}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=["sameershahh.05@gmail.com"],  
            fail_silently=False,
        )