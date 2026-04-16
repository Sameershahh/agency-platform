# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import ContactMessage

# import the utils function so serializer can call it
from .utils import send_verification_email

from .models import CustomUser

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=True)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ["full_name", "email", "password", "confirm_password"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        user.is_active = False
        user.is_email_verified = False
        user.save()

        request = self.context.get("request")
        if request is not None:
            send_verification_email(user, request)

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "is_email_verified"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Support both 'email' and 'username' keys from frontend
        email = attrs.get("email") or attrs.get("username")
        password = attrs.get("password")

        if not email:
            raise serializers.ValidationError({"detail": "Email field is missing in request"})
        if not password:
            raise serializers.ValidationError({"detail": "Password field is missing in request"})

        try:
            # Case-insensitive email lookup for robustness
            user = CustomUser.objects.get(email__iexact=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"detail": f"No user found with email: {email}"})

        if not user.check_password(password):
            raise serializers.ValidationError({"detail": "Incorrect password provided"})

        if not user.is_email_verified:
            raise serializers.ValidationError({"detail": "Account exists but email is not verified"})

        # SimpleJWT expects the username field to be present
        attrs[self.username_field] = user.email
        
        try:
            return super().validate(attrs)
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Authentication system error: {str(e)}"})

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

