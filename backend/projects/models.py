from django.db import models
from django.conf import settings

class Project(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("pending", "Pending"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField()
    client_name = models.CharField(max_length=150, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    category = models.CharField(max_length=100, blank=True)
    technologies = models.JSONField(default=list, blank=True)
    thumbnail = models.ImageField(upload_to="project_thumbs/", blank=True, null=True)
    featured = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def short_description(self):
        return (self.description[:220] + "...") if len(self.description) > 220 else self.description

    def __str__(self):
        return f"{self.title} ({self.status})"
