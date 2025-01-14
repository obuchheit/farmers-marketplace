from rest_framework import serializers
from .models import Message, Conversation
from user_app.models import User

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id', 'username', 'email']

class ConversationSerializer(serializers.ModelSerializer):

  class Meta:
    model = Conversation
    fields = "__all__"

class MessageSerializer(serializers.ModelSerializer):
  
  class Meta:
    model = Message
    fields = "__all__"
    # read_only_fields = ['timestamp']
    # Not sure if I neet this....