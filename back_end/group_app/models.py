from django.db import models
from user_app.models import User
from user_app.views import TokenReq


class Group(models.Model):
    group_name = models.CharField(null=True)
    group_description = models.TextField(blank=True, null=True)
    group_image = models.ImageField(blank=True, null=True)
    location = models.CharField(max_length=5)
    group_user = models.ManyToManyField(User, related_name='group')