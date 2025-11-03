from rest_framework import serializers
from .models import Project

class ProjectListSerializer(serializers.ModelSerializer):
    short_description = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = ["id", "title", "slug", "short_description", "thumbnail", "status", "category", "technologies", "start_date", "end_date", "featured"]

class ProjectDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
