from django.db import models
import geocoder
from requests_oauthlib import OAuth1
from marketplace_proj.settings import env

token = 'pk.eyJ1Ijoib2J1Y2hoZWl0IiwiYSI6ImNtM3AwamlqNTA5YWkya3FhZmt4cXMwMnYifQ.qvtyMdcq82bivZRMyYd7GQ'
#token = OAuth1(env.get("MAPBOX_ACCESS_TOKEN"))

class Address(models.Model):
    address = models.TextField()
    lat = models.FloatField(blank=True, null=True)
    lon = models.FloatField(blank=True, null=True)

    def save(self, *args, **kwargs):
        g = geocoder.mapbox(self.address, key=token)
        g = g.latlng

        self.lat = g[0]
        self.lon = g[1]

        return super(Address, self).save(*args, **kwargs)

