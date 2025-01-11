import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message, Conversation
from user_app.models import User
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
  async def connect(self):
    # Get the room name from the URL
    print("in connect")
    self.sender = self.scope['user']
    self.convo_name = self.scope['url_route']['kwargs']['conversation_id']
    # self.room_group_name = f'chat_{self.room_name}'

    # Join the room group
    await self.channel_layer.group_add(
      self.convo_name,
      self.channel_name
    )

    await self.accept()

  async def disconnect(self, close_code):
    # Leave the room group
    await self.channel_layer.group_discard(
      self.convo_name,
       self.channel_name
    )

  async def receive(self, text_data):

    message_data = json.loads(text_data)
    message_content = message_data["message"]
    username = message_data["username"]
    # token = message_data["token"]
    # print(token)

    # user = await sync_to_async(User.objects.get)(email=username)
    # print(user)
    # conversation = await sync_to_async(Conversation.objects.get)(id=self.convo_name)
    # sender = self.scope['user']
    # print(sender)

    # # Create a new message
    # new_message = await sync_to_async(Message.objects.create)(
    #   sender=sender,
    #   conversation=conversation,
    #   content=message_content
    # )

    # Send message to the room group
    await self.channel_layer.group_send(
      self.convo_name,
      {
        'type': 'chat_message',
        'message': message_content,
        'sender': username
      }
    )

  async def chat_message(self, event):
    # Send message to WebSocket
    message = event['message']
    await self.send(text_data=json.dumps({
      'message': message
    }))