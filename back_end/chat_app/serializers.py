from rest_framework import serializers
from .models import Message
from user_app.models import User

class UserSerializer(serializers.ModelSerializer):
  class Mete:
    model = User
    fields = ['id', 'username', 'email']

class MessageSerializer(serializers.ModelSerializer):
  
  class Meta:
    model = Message
    fields = "__all__"
    # read_only_fields = ['timestamp']
    # Not sure if I neet this....