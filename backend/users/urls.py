from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import  profile_view, CustomLoginView, VerifyEmailView, GoogleAuthView, email_verified, ResendVerificationEmailView, LogoutView,  PasswordResetRequestView, PasswordResetConfirmView, ContactMessageView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', profile_view, name='profile'),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("email-verified/", email_verified, name="email-verified"),
    path("google/", GoogleAuthView.as_view(), name="google-auth"),
    path("resend-verification/", ResendVerificationEmailView.as_view(), name="resend-verification"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("password-reset-request/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("password-reset-confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path('contact/', ContactMessageView.as_view(), name='contact'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


]
