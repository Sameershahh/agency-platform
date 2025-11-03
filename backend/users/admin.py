from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, ContactMessage

@admin.register(CustomUser)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "email", "first_name",
        "is_active", "is_email_verified", "date_joined",
    )
    list_filter = ("is_active", "is_email_verified", "is_staff", "is_superuser")
    search_fields = ("email", "first_name")
    ordering = ("-date_joined",)
    readonly_fields = ("last_login", "date_joined")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name",)}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "is_email_verified")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "password1", "password2"),
        }),
    )

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at", "replied")
    list_filter = ("replied", "created_at")
    search_fields = ("name", "email", "message")
    readonly_fields = ("name", "email", "message", "created_at")
    ordering = ("-created_at",)

    actions = ["mark_as_replied"]

    @admin.action(description="Mark selected messages as replied")
    def mark_as_replied(self, request, queryset):
        updated = queryset.update(replied=True)
        self.message_user(request, f"{updated} message(s) marked as replied.")