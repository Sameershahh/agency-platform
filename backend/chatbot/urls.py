from django.urls import path
from .views import ChatView, DocumentUploadView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('upload/', DocumentUploadView.as_view(), name='upload'),
]
