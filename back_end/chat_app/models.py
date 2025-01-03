from django.db import models
from user_app.models import User

# Create your models here.
class Conversation(models.Model):
  name = models.CharField(max_length=255, blank=True, null=True)
  users = models.ManyToManyField(User, related_name='conversations')
  is_group = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    if self.is_group:
      return f"Group: {self.name}"
    else:
      # Private conversation name, might be combined user names or something else.
      return f"Conversation between {self.users.first()} and {self.users.last()}"
  
class Message(models.Model):
  sender = models.ForeignKey(User, on_delete=models.CASCADE)
  conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
  content = models.TextField() # The message contents
  timestamp = models.DateTimeField(auto_now_add=True)
  is_read = models.BooleanField(default=False)

  def __str__(self):
    return f"Message from {self.sender} at {self.timestamp}"
  
  # class Meta:
  #   ordering = ['timestamp']

# class RoomMember(models.Model):
#   user = models.ForeignKey(User, on_delete=models.CASCADE)
#   room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
#   joined_at = models.DateTimeField(auto_now_add=True)

#   def __str__(self):
#     return f"{self.user.username} in {self.room.name}"
  
#   class Meta:
#     unique_together = ['user', 'room']