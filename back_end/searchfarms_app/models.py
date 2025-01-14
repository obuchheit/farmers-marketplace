from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point

class Farm(gis_models.Model):
    listing_id = models.IntegerField()
    listing_name = models.CharField(max_length=255)
    location_address = models.CharField(max_length=255)
    location = gis_models.PointField(srid=4326, blank=True, null=True)  # SRID set for WGS84
    orgnization = models.CharField(max_length=255, blank=True, null=True)
    listing_desc = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.listing_name} (ID: {self.listing_id}, Address: {self.location_address})"

    
    def save(self, *args, **kwargs):
        print(f"Saving Farm: {self.listing_name}, Address: {self.location_address}, Location: {self.location}")
        if Farm.objects.filter(listing_name=self.listing_name, location_address=self.location_address).exists():
            raise ValueError("Duplicate listing: This combination of name and address already exists.")
        super().save(*args, **kwargs)
