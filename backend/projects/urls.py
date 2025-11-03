from django.urls import path
from .views import ProjectListCreateView  # Assuming this is your CRUD view
from .dashboard_views import DashboardStatsView

urlpatterns = [
    path("projects/", ProjectListCreateView.as_view(), name="project-list-create"),
    path("dashboard/", DashboardStatsView.as_view(), name="dashboard"),
]
