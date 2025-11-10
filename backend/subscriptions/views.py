from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import PricingPlan, Payment
from .serializers import PricingPlanSerializer, PaymentSerializer
import uuid

# --------------------------
# List available plans
# --------------------------
class PricingPlanListView(generics.ListAPIView):
    queryset = PricingPlan.objects.all()
    serializer_class = PricingPlanSerializer
    permission_classes = [AllowAny]

# --------------------------
# Create a payment (test only for now)
# --------------------------
class CreatePaymentView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get("plan_id")
        plan = PricingPlan.objects.filter(id=plan_id).first()
        if not plan:
            return Response({"error": "Invalid plan ID"}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.create(
            user=request.user,
            plan=plan,
            amount=plan.price,
            transaction_id=str(uuid.uuid4())[:10],
            status="PAID",  # mark as paid for now
        )
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
