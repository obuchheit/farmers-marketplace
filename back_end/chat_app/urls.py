from django.urls import path
from .views import StartChatView, ChatView

urlpatterns = [
    path('start-chat/', StartChatView.as_view(), name='start-chat'),  # Create a new chat
    path('conversations/<int:conversation_id>/messages/', ChatView.as_view(), name='send-message'),  # Send a message to a specific conversation
]