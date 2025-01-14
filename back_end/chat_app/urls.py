from django.urls import path
from .views import ChatView, SingleChatView

urlpatterns = [
    path('chats/', ChatView.as_view(), name='get-chats'), # List all chats
    path('start-chat/', ChatView.as_view(), name='start-chat'),  # Create a new chat
    path('<int:conversation_id>/', SingleChatView.as_view(), name='single-chat') # View single chat
]