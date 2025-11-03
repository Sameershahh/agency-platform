from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "client_name", "status", "category", "start_date", "end_date", "created_at")
    list_filter = ("status", "category", "featured")
    search_fields = ("title", "client_name", "description")
    prepopulated_fields = {"slug": ("title",)}
