from django.db import models
from django.contrib.auth.models import AbstractUser

class AppUser(AbstractUser):
    email = models.EmailField(
        verbose_name='email_address',
        max_length=255,
        unique=True,
    )
    first_name = models.CharField(max_length=30, blank=False, null=True)
    last_name = models.CharField(max_length=30, blank=False, null=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    profile_picture = models.ImageField(blank=True, null=True)
    location = models.CharField(blank=False, null=True, default='92039')
    bio = models.TextField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
