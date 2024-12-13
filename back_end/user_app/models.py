from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings
import requests
from django.contrib.gis.db import models as gis_models
from marketplace_proj.utils import get_coordinates_from_address



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
    is_active = models.BooleanField(default=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    profile_picture = models.ImageField(
        verbose_name=_('Profile Picture'),
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )
    location = gis_models.PointField(blank=True, null=True)
    address = models.CharField(
        verbose_name=_('Location Address'),
        max_length=100,
        blank=False,
        null=True,
        default='92039'
    )
    bio = models.TextField(
        verbose_name=_('Biography'),
        blank=True,
        null=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

     # Use Mapbox Geocoding API to fetch latitude and longitude
    def save(self, *args, **kwargs):
        if self.address:
            latitude, longitude = self.get_coordinates_from_address(self.address)
            if latitude and longitude:
                self.location = gis_models.Point(longitude, latitude)
        super().save(*args, **kwargs)


 
    @staticmethod
    def get_coordinates(address):
        return get_coordinates_from_address(address)

    def __str__(self):
        return self.email


class AdminProfile(models.Model):
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
    
"""TODO: Figure out where and how to implement BusinessUser Model."""
class BusinessUser(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='business_user'
    )
    business_type = models.CharField(
        verbose_name=_('Business Type')
    )
    permissions = models.JSONField(
        verbose_name=_('Permissions'),
        blank=True,
        null=True
    )
    business_name = models.CharField(max_length=100, blank=True, null=True)
    connected_to_directory = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def email(self):
        return self.user.email

    def __str__(self):
        return f"{self.business_name} ({self.email})"
    
