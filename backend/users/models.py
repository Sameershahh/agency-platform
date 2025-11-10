from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, full_name=None, **extra_fields):
        if not email:
            raise ValueError("Email field is required")
        if not full_name:
            raise ValueError("Full name is required for user signup")

        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, full_name="Admin", **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_email_verified", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        # directly call create_user (no recursion)
        return self.create_user(
            email=email,
            password=password,
            full_name=full_name,
            **extra_fields
        )

        
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False)   # start inactive until email verified
    is_staff = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)  
    date_joined = models.DateTimeField(auto_now_add=True)

    email_verification_code = models.CharField(max_length=6, blank=True, null=True)
    email_verification_expiry = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    @property
    def first_name(self):
        return self.full_name.split(" ")[0] if self.full_name else ""

    @property
    def get_initials(self):
        parts = (self.full_name or "").split()
        return "".join([p[0].upper() for p in parts[:2]]) if parts else ""

    def __str__(self):
        return self.email

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    replied = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({'Replied' if self.replied else 'Pending'})"