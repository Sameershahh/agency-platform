from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        
        if header is None:
            # Look for token in cookies
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None
            print(f"DEBUG: No header, raw_token from cookie: {raw_token[:10] if raw_token else None}")
        else:
            raw_token = self.get_raw_token(header)
            print(f"DEBUG: Header present, raw_token: {raw_token[:10] if raw_token else None}")

        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except Exception as e:
            print(f"DEBUG: Token validation failed: {str(e)}")
            return None
