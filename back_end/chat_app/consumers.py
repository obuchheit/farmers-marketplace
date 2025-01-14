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
    print('in recieve')
    message_data = json.loads(text_data)
    message_content = message_data["message"]
    sender_id = message_data['senderId']
    print(message_content)

    await self.channel_layer.group_send(
      self.convo_name,
      {
        'type': 'chat_message',
        'message': message_content,
        'senderId': sender_id,
      }
    )

  async def chat_message(self, event):
    print("in chat_message")
    # Send message to WebSocket
    message = event['message']
    sender_id = event['senderId']

    await self.send(text_data=json.dumps({
      'message': message,
      'senderId': sender_id,
    }))