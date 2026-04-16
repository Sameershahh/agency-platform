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


from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.views import TokenRefreshView

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # pass request explicitly into serializer context so send_verification_email can build absolute URIs
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "User registered. Please check your email for the 6-digit verification code."}, status=status.HTTP_201_CREATED) 


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

        # Generate tokens so user is logged in after verification
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response(
            {"message": "Email verified successfully.", "user": UserSerializer(user).data},
            status=status.HTTP_200_OK
        )

        # Set Cookies
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=access_token,
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=refresh_token,
            expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )

        return response

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
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({
            "user": UserSerializer(user).data,
            "message": "Login successful"
        }, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)

        # Set Cookies
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=access_token,
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=refresh_token,
            expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )
        return response

def email_verified(request):
    return JsonResponse({"message": "Email verified! You can now log in."})

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)

        if user is not None:
            if not user.is_email_verified:
                return Response({"detail": "Please verify your email before logging in."}, status=status.HTTP_403_FORBIDDEN)
            
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response = Response({
                "user": UserSerializer(user).data,
                "message": "Login successful"
            }, status=status.HTTP_200_OK)

            # Set Cookies
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=refresh_token,
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )
            return response
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

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            
            # Remove tokens from response body if you want strict cookie-only
            # response.data.pop('access', None)
            # response.data.pop('refresh', None)

            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=refresh_token,
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # The refresh token might be in the cookie instead of the request body
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        if refresh_token and 'refresh' not in request.data:
            # Inject the cookie token into the request data for the standard view to process
            request.data['refresh'] = refresh_token
            
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            # Set the new access token in cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )
            # Also update refresh token if rotation is on
            refresh_token = response.data.get('refresh')
            if refresh_token:
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                    value=refresh_token,
                    expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                    path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
                )
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


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
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        if not refresh_token:
            refresh_token = request.data.get("refresh")
            
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            response = Response(
                {"message": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception:
            # Fallback even if token fails
            response = Response(
                {"error": "Invalid or expired token, but local session cleared."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Ensure cookies are properly cleared by matching the SAMESITE, SECURE and PATH attributes exactly
        for cookie_name in [settings.SIMPLE_JWT['AUTH_COOKIE'], settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH']]:
            response.delete_cookie(
                cookie_name,
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                # secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'], # Django's delete_cookie might not take secure depending on version, but doing set_cookie with expired is safer

            )
            # A foolproof way to delete cookies cross-domain is setting them to empty with past expiry
            response.set_cookie(
                key=cookie_name,
                value="",
                expires="Thu, 01 Jan 1970 00:00:00 GMT",
                max_age=0,
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )

        return response




from django.conf import settings

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
            # Security: Don't reveal if user exists
            return Response(
                {"message": "If an account exists with this email, you will receive password reset instructions."},
                status=status.HTTP_200_OK
            )

        # Generate reset token and code
        token = generate_password_reset_token(user)
        code = get_random_string(length=6, allowed_chars='0123456789')
        user.password_reset_code = code
        user.password_reset_expiry = timezone.now() + timezone.timedelta(minutes=15)
        user.save(update_fields=['password_reset_code', 'password_reset_expiry'])

        # Build FRONTEND reset link (not backend!)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        reset_link = f"{frontend_url.rstrip('/')}/reset-password?token={token}"

        # Send email
        html_message = f"""
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://neurastack-agency.vercel.app/NeuraStack.png" alt="NeuraStack Logo" style="max-width: 180px; height: auto;">
            </div>
            <div style="color: #374151; font-size: 16px; line-height: 1.6;">
                <p>Hello,</p>
                <p>We received a request to reset the password for your NeuraStack account.</p>
                <p>Your 6-digit password reset code is:</p>
                <div style="text-align: center; margin: 35px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px dashed #d1d5db;">
                    <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #111827;">{code}</span>
                </div>
                <p style="font-size: 14px; color: #6b7280;">This code will expire in 15 minutes.</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" style="display: inline-block; padding: 12px 24px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">Or Click Here to Reset</a>
                </p>
                <p style="font-size: 14px; color: #6b7280;">If you didn't request a password reset, you can safely ignore this email. Your account is secure.</p>
                <br>
                <p>Best regards,<br><strong>Sameer Shah</strong><br><span style="color: #6b7280; font-size: 14px;">Founder & Lead Developer</span></p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 20px 0;">
            <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                &copy; 2026 NeuraStack Agency. All rights reserved.
            </div>
        </div>
        """

        try:
            send_mail(
                subject="Password Reset Request - NeuraStack",
                message=(
                    f"Hello,\n\n"
                    f"You requested to reset your password.\n\n"
                    f"Your 6-digit password reset code is: {code}\n"
                    f"This code will expire in 15 minutes.\n\n"
                    f"Alternatively, you can click this link to reset your password:\n{reset_link}\n\n"
                    f"If you didn't request this, please ignore this email.\n"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
                html_message=html_message
            )
        except Exception as e:
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


class PasswordResetVerifyView(APIView):
    """
    GET /api/password-reset-verify/<token>/
    Verifies if the token is valid (no redirects, backend only).
    """
    permission_classes = [AllowAny]

    def get(self, request, token):
        data = verify_password_reset_token(token)
        if not data:
            return Response(
                {"valid": False, "detail": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"valid": True, "detail": "Token is valid."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    """
    POST /api/password-reset-confirm/
    Accepts new password with token or 6-digit code.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        code = request.data.get("code")
        new_password = request.data.get("new_password")

        if not new_password:
            return Response(
                {"detail": "New password is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = None

        # Token-based reset
        if token:
            data = verify_password_reset_token(token)
            if not data:
                return Response(
                    {"detail": "Invalid or expired token."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            user = User.objects.filter(id=data.get("user_id")).first()

        # Code-based reset
        elif code:
            user = User.objects.filter(password_reset_code=code).first()
            if not user or not user.password_reset_expiry or timezone.now() > user.password_reset_expiry:
                return Response(
                    {"detail": "Invalid or expired code."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        else:
            return Response(
                {"detail": "Either token or 6-digit code is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user:
            return Response(
                {"detail": "User not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Set new password
        user.set_password(new_password)
        
        # As a precaution, ensure the user is active and verified since they successfully used a reset link/code
        user.is_active = True
        user.is_email_verified = True
        
        user.password_reset_code = None
        user.password_reset_expiry = None
        
        # Full save to ensure all fields (including hashed password) are persisted
        user.save()

        return Response(
            {"message": "Password has been reset successfully. You can now log in with your new password."}, 
            status=status.HTTP_200_OK
        )


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
        html_message = f"""
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://neurastack-agency.vercel.app/NeuraStack.png" alt="NeuraStack Logo" style="max-width: 180px; height: auto;">
                <h2 style="color: #111827; margin-top: 15px; font-weight: 700; letter-spacing: -0.5px;">New Contact Request</h2>
            </div>
            <div style="color: #374151; font-size: 16px; line-height: 1.6;">
                <p>Hello <strong>Sameer</strong>,</p>
                <p>You have received a new message from the NeuraStack contact form:</p>
                <div style="margin: 25px 0; padding: 25px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #111827;">
                    <p style="margin: 0 0 10px 0;"><strong>Name:</strong> {contact.name}</p>
                    <p style="margin: 0 0 20px 0;"><strong>Email:</strong> <a href="mailto:{contact.email}" style="color: #2563eb; text-decoration: none;">{contact.email}</a></p>
                    <p style="margin: 0 0 5px 0;"><strong>Message:</strong></p>
                    <p style="margin: 0; white-space: pre-wrap; font-style: italic; color: #4b5563;">"{contact.message}"</p>
                </div>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 20px 0;">
            <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                &copy; 2026 NeuraStack Agency Automated Notifications.
            </div>
        </div>
        """

        send_mail(
            subject=f"New Contact Message from {contact.name}",
            message=(
                f"Name: {contact.name}\n"
                f"Email: {contact.email}\n\n"
                f"Message:\n{contact.message}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],  
            fail_silently=False,
            html_message=html_message
        )