import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message, Conversation
from user_app.models import User
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
  async def connect(self):
    # Get the room name from the URL
    print("in connect")
    self.room_name = self.scope['url_route']['kwargs']['conversation_id']
    # self.room_group_name = f'chat_{self.room_name}'

    # Join the room group
    await self.channel_layer.group_add(
      self.room_name,
      self.channel_name
    )

    await self.accept()

  async def disconnect(self, close_code):
    # Leave the room group
    await self.channel_layer.group_discard(
      self.room_name,
       self.channel_name
    )

  async def receive(self, text_data):
    # Receive message from WebSocket and send it to the group
    text_data_json = json.loads(text_data)
    message = text_data_json['message']

    # Fetch the conversation from the database
    conversation = await sync_to_async(Conversation.objects.get)(id=self.room_name)
    sender = self.scope['user']

    # Create a new message
    new_message = await sync_to_async(Message.objects.create)(
      sender=sender,
      conversation=conversation,
      content=message
    )

    # Send message to the room group
    await self.channel_layer.group_send(
      self.room_name,
      {
        'type': 'chat_message',
        'message': new_message.content
      }
    )

  async def chat_message(self, event):
    # Send message to WebSocket
    message = event['message']
    await self.send(text_data=json.dumps({
      'message': message
    }))