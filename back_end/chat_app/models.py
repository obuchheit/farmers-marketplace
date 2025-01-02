from django.db import models
from user_app.models import User

# Create your models here.
class ChatRoom(models.Model):
  name = models.CharField(max_length=255, unique=True)
  is_private = models.BooleanField(default=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.name
  
class Message(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
  content = models.TextField() # The message contents
  timestamp = models.DateTimeField(auto_now_add=True)
  is_read = models.BooleanField(default=False)

  def __str__(self):
    return f"Message from {self.user.username} in {self.room.name} at {self.timestamp}"
  
  class Meta:
    ordering = ['timestamp']

class RoomMember(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
  joined_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.user.username} in {self.room.name}"
  
  class Meta:
    unique_together = ['user', 'room']