from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("", include(("users.urls", "users"), namespace="users")),
    #path('', include('chatbot.urls')),
    path('accounts/', include('allauth.urls')),
    path("", include("projects.urls")),
    path("", include("subscriptions.urls")),
]




