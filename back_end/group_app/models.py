from django.db import models
from user_app.models import User
from django.conf import settings
import requests
from django.contrib.gis.db import models as gis_models
from marketplace_proj.utils import get_coordinates_from_address



class Group(models.Model):
    name = models.CharField(null=True)
    description = models.TextField(blank=True, null=True)
    group_image = models.ImageField(
        blank=True,
        null=True,
        upload_to='group_images/',
        default='group_images/group_default.png',
        )
    address = models.CharField(blank=False, null=True)
    location = gis_models.PointField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='created_groups'
    )


     # Use Mapbox Geocoding API to fetch latitude and longitude
    def save(self, *args, **kwargs):
        if self.address:
            latitude, longitude = self.get_coordinates_from_address(self.address)
            if latitude and longitude:
                self.location = gis_models.Point(longitude, latitude)
        super().save(*args, **kwargs)
 
    #Uses Mapbox Geocoding API to convert an address into latitude and longitude.
    @staticmethod
    def get_coordinates(address):
        return get_coordinates_from_address(address)
        
    


class GroupMember(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('member', 'Member'),
    )

    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="groups_members")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    class Meta:
        unique_together = ('group', 'user')

    def __str__(self):
        return f"{self.user} - {self.group} - {self.role}"


class JoinRequest(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="join_requests")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="join_requests")
    request_date = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Request by {self.user} to join {self.group} - Approved: {self.is_approved}"
    

class Invitation(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="invitations")
    invited_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_invitaitons")
    invitee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recieved_invitations")
    staus = models.CharField(
        max_length=10,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('group', 'invitee')

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user} - {self.message[:50]}"

