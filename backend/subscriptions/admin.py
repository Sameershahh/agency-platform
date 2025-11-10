from django.contrib import admin
from .models import PricingPlan, Payment

@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "description", "created_at")
    search_fields = ("name",)
    ordering = ("price",)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("user", "plan", "amount", "transaction_id", "status", "created_at")
    search_fields = ("transaction_id", "user__email")
    list_filter = ("status", "created_at")
    ordering = ("-created_at",)
