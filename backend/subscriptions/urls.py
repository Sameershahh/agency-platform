from django.urls import path
from .views import PricingPlanListView, CreatePaymentView

urlpatterns = [
    path("plans/", PricingPlanListView.as_view(), name="pricing-plans"),
    path("pay/", CreatePaymentView.as_view(), name="initiate-payment"),
]
