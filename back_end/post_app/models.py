from django.db import models
from user_app.models import User
from django.conf import settings
import requests
from django.contrib.gis.db import models as gis_models
from marketplace_proj.utils import get_coordinates_from_address
from django.contrib.gis.geos import Point



class UserPosts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_posts', default=1)
    image = models.ImageField(blank=True, null=True)
    title = models.CharField(blank=False, null=True)
    description = models.TextField(blank=False, null=True)
    location = gis_models.PointField(blank=True, null=True, default='92039')
    address = models.CharField(blank=False, null=True)
    time_posted = models.DateTimeField(auto_now_add=True)
    is_available = models.BooleanField(default=True, null=True)
    is_public = models.BooleanField(default=True, null=True)

    # Use Mapbox Geocoding API to fetch latitude and longitude
    def save(self, *args, **kwargs):
        if self.address:
            latitude, longitude = self.get_coordinates(self.address)
            if latitude and longitude:
                self.location = Point(longitude, latitude)
        super().save(*args, **kwargs)

    #Uses Mapbox Geocoding API to convert an address into latitude and longitude.
    @staticmethod
    def get_coordinates(address):
        return get_coordinates_from_address(address)


class UserSavedPosts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_posts')
    post = models.ForeignKey(UserPosts, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Prevents duplicate saves of the same post by a user




