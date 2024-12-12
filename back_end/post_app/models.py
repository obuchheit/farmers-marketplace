from django.db import models
from user_app.models import User
from django.conf import settings
import requests
from django.contrib.gis.db import models as gis_models

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
            latitude, longitude = self.get_coordinates_from_address(self.address)
            if latitude and longitude:
                self.location = gis_models.Point(longitude, latitude)
        super().save(*args, **kwargs)


 
    #Uses Mapbox Geocoding API to convert an address into latitude and longitude.
    @staticmethod
    def get_coordinates_from_address(address):
       
        MAPBOX_ACCESS_TOKEN = settings.MAPBOX_ACCESS_TOKEN
        url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json"
        params = {
            "access_token": MAPBOX_ACCESS_TOKEN,
            "limit": 1
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data['features']:
                coords = data['features'][0]['geometry']['coordinates']
                return coords[1], coords[0]  # Latitude, Longitude
        return None, None


class UserSavedPosts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_posts')
    post = models.ForeignKey(UserPosts, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Prevents duplicate saves of the same post by a user




