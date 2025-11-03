from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from projects.models import Project
from users.models import CustomUser
from django.utils import timezone
from datetime import timedelta
from django.db import models   

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Count active projects
        active_projects = Project.objects.filter(status="active").count()

        # Total users (clients or team)
        total_users = CustomUser.objects.count()

        # Processing power (dummy value or system metric placeholder)
        processing_power = 87  # e.g., percentage of available compute

        # System uptime (placeholder — can integrate with psutil or API later)
        system_uptime = "99.98%"

        # Performance trend (project creation over last 7 days)
        last_7_days = [timezone.now().date() - timedelta(days=i) for i in range(6, -1, -1)]
        performance_data = []
        for day in last_7_days:
            count = Project.objects.filter(created_at__date=day).count()
            performance_data.append({"date": day.strftime("%Y-%m-%d"), "count": count})

        # Project distribution by category or tech stack
        project_distribution = (
            Project.objects.values("category")
            .order_by("category")
            .annotate(count=models.Count("id"))
        )

        # Return all metrics to frontend
        return Response({
            "active_projects": active_projects,
            "total_users": total_users,
            "processing_power": processing_power,
            "system_uptime": system_uptime,
            "performance_trend": performance_data,
            "project_distribution": list(project_distribution),
        })
