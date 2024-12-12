from django.db import models
from user_app.models import User

class UserPosts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_posts', default=1)
    image = models.ImageField(blank=True, null=True)
    title = models.CharField(blank=False, null=True)
    description = models.TextField(blank=False, null=True)
    location = models.CharField(blank=False, null=True)
    time_posted = models.DateTimeField(auto_now_add=True)
    is_available = models.BooleanField(default=True, null=True)
    is_public = models.BooleanField(default=True, null=True)

class UserSavedPosts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_posts')
    post = models.ForeignKey(UserPosts, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Prevents duplicate saves of the same post by a user




