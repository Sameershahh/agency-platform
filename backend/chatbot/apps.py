import threading
from django.apps import AppConfig

class ChatbotConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "chatbot"

    def ready(self):
        def preload():
            from .utils.embedder import get_index
            get_index()
            print(" FAISS index preloaded in background.")
        threading.Thread(target=preload, daemon=True).start()
