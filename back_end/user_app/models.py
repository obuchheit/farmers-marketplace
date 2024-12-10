from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

"""TODO:
Figure out how to implement permissions and what permissions the Admin
and Business models will have. Business models will be more feature centered
and Admin will be admin.
"""

class User(AbstractUser):
    email = models.EmailField(
        verbose_name=_('Email Address'),
        max_length=255,
        unique=True
    )
    first_name = models.CharField(
        verbose_name=_('First Name'),
        max_length=30,
        blank=False,
        null=True
    )
    last_name = models.CharField(
        verbose_name=_('Last Name'),
        max_length=30,
        blank=False,
        null=True
    )
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    profile_picture = models.ImageField(
        verbose_name=_('Profile Picture'),
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )
    location = models.CharField(
        verbose_name=_('Location'),
        max_length=100,
        blank=True,
        null=True,
        default='92039'
    )
    bio = models.TextField(
        verbose_name=_('Biography'),
        blank=True,
        null=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

class AdminProfile(models.Model):
    """
    Admin model with one-to-one Relationship with AppUser model
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='admin_profile'
    )
    admin_role = models.CharField(
        verbose_name=_('Admin Role'),
        max_length=50
    )
    permissions = models.JSONField(
        verbose_name=_('Permissions'),
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.admin_role} - {self.user.email}"
    

class BusinessUser(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='business_profile'
    )
    business_type = models.CharField(
        verbose_name=_('Business Type')
    )
    permissions = models.JSONField(
        verbose_name=_('Permissions'),
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
