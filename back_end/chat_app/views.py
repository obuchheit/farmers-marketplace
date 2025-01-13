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
import random
import string
from django.db.models import Q

# Create your views here.
class TokenReq(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

def generate_random_name(length=16):
  return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

class ChatView(TokenReq):
  # start new chat with user
  def post(self, request, *args, **kwargs):
    print('Here in post StartChatView')
    print(request.data)
       
    # get user ids of users in chat
    users = request.data.get('user_ids', [])
    name = generate_random_name()
    
    print(f"Generated name: {name}")
    
    if len(users) != 2:
      return JsonResponse({"error": "At least two user IDs are required"}, status=HTTP_400_BAD_REQUEST)
    
    # check that userids are not the same
    other_user = get_object_or_404(User, id=users[0])
    if request.user == other_user:
      return JsonResponse({"error": "You cannot start a chat with yourself"}, status=HTTP_400_BAD_REQUEST)
    
    # private chat (2 user ids, self and other)
    if len(users) == 2:
      
      print(other_user)
      print(request.user)

      existing_chat = Conversation.objects.filter(
        is_group=False,  # Ensure it's a private conversation (not a group chat)
      ).filter(
        Q(users=request.user)   # Ensure both users are in the same chat
      ).filter(
        Q(users=other_user)
      )

      print(existing_chat)

      if existing_chat.exists():
        print("existing chat found")
        return JsonResponse({"message": "Chat already exists"}, status=HTTP_400_BAD_REQUEST)
      
      conversation = Conversation.objects.create(is_group=False, name=name)
      conversation.users.add(request.user, other_user)

      message = Message.objects.create(
        sender=request.user,  # Logged-in user
        conversation=conversation,  # The conversation just created
        content=request.data.get('message', ''),  # Message content from the request
      )

      return JsonResponse({
        'message': 'Chat started and message sent',
        'conversation_id': conversation.id,
        'message_id': message.id
      })

    # private group chat (multiple users)
    # for later
    else:
      pass

  def get(self, request):
    print('here in get chats')
    conversations = Conversation.objects.filter(users=request.user)
    print(conversations)

    chats_data = []
    for conversation in conversations:
      # Get other users in the conversation
      other_users = conversation.users.exclude(id=request.user.id)

      # Collect the user information for the other participants
      chat_info = {
        "conversation_id": conversation.id,
        "is_group": conversation.is_group,
        "name": conversation.name,
        "other_users": [{"id": user.id, "full_name": f"{user.first_name} {user.last_name}"} for user in other_users]
      }

      chats_data.append(chat_info)
    
    return JsonResponse({"chats": chats_data})

class SingleChatView(TokenReq):

  def get(self, request, conversation_id):
    print("here in single chat view")
    conversation = get_object_or_404(Conversation, id=conversation_id)
    messages = Message.objects.filter(conversation=conversation).order_by('timestamp')
    serializer = MessageSerializer(messages, many=True)
    return JsonResponse({"messages": serializer.data})
    pass

class MessageView(TokenReq):

  def post(self, request):
    
    pass
# class ChatView(TokenReq):
#   # sending message in chat conversation
#   def post(self, request, conversation_id):
#     conversation = get_object_or_404(Conversation, id=conversation_id)
#     message_content = request.data.get('message', '')
    
#     if not message_content:
#       return JsonResponse({"error": "Message content is required"}, status=HTTP_400_BAD_REQUEST) 

#     message = Message.objects.create(
#        user=request.user,
#        conversation=conversation,
#        content=message_content
#     )
#     serializer = MessageSerializer(message)
#     return Response(serializer.data, status=HTTP_201_CREATED)
  
#   def get(self, request, conversation_id):
#     # get all messages
#     conversation = Conversation.objects.get(id=conversation_id)
#     messages = Message.objects.filter(conversation=conversation).order_by('timestamp')
#     serializer = MessageSerializer(messages, many=True)
#     return Response(serializer.data)
    