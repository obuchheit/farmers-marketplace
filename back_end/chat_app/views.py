from django.shortcuts import render, get_object_or_404, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Message, Conversation
from .serializers import MessageSerializer
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from user_app.models import User
from django.http import JsonResponse

# Create your views here.
class TokenReq(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

class StartChatView(TokenReq):
  # start new chat with user
  def post(self, request, *args, **kwargs):
    # get user ids of users in chat
    user_ids = request.data.get('user_ids', [])
    group_name = request.data.get('group_name', None)
    
    if len(user_ids) < 1:
      return JsonResponse({"error": "At least one user ID is required"}, status=HTTP_400_BAD_REQUEST)
    
    # private chat (two users)
    if len(user_ids) == 1:
      other_user = get_object_or_404(User, id=user_ids[0])
      if request.user == other_user:
        return JsonResponse({"error": "You cannot start a chat with yourself"}, status=HTTP_400_BAD_REQUEST)

      existing_chat = Conversation.objects.filter(user=request.user, users=other_user)
      if existing_chat.exists():
        return JsonResponse({"message": "Chat already exists"}, status=HTTP_400_BAD_REQUEST)
      
      conversation = Conversation.objects.create(is_group=False)
      conversation.users.add(request.user, other_user)

    # private chat (multiple)
    else:
      
      # Logic here for setting up auto group name instead?
      if not group_name:
        return JsonResponse({"error": "Group name is required for group chats"}, status=HTTP_400_BAD_REQUEST)

      existing_group_chat = Conversation.objects.filter(is_group=True, name=group_name)
      if existing_group_chat.exists():
        return JsonResponse({"message": "Group chat with this name already exists"}, status=HTTP_400_BAD_REQUEST)

      conversation = Conversation.objects.create(name=group_name, is_group=True)
      conversation.users.add(request.user, *user_ids)

    return JsonResponse({
      'message': 'Chat started',
      'conversation_id': conversation.id
    })

class ChatView(TokenReq):
  # sending message in chat conversation
  def post(self, request, conversation_id):
    conversation = get_object_or_404(Conversation, id=conversation_id)
    message_content = request.data.get('message', '')
    
    if not message_content:
      return JsonResponse({"error": "Message content is required"}, status=HTTP_400_BAD_REQUEST) 

    message = Message.objects.create(
       user=request.user,
       conversation=conversation,
       content=message_content
    )
    serializer = MessageSerializer(message)
    return Response(serializer.data, status=HTTP_201_CREATED)
  
  def get(self, request, conversation_id):
    # get all messages
    conversation = Conversation.objects.get(id=conversation_id)
    messages = Message.objects.filter(conversation=conversation).order_by('timestamp')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)
    