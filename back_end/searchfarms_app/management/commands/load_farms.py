import json
import os
from django.conf import settings
from django.core.management.base import BaseCommand 
from django.contrib.gis.geos import Point
from searchfarms_app.models import Farm

class Command(BaseCommand):
    help = 'Load farm data from JSON files into the database'

    def handle(self, *args, **kwargs):
        json_files = [
            'static/agritourism/agritourismJSON.json',
            'static/csa/csaJSON.json',
            'static/farmers_market/farmers_marketJSON.json',
            'static/foodhub/foodhubJSON.json',
            'static/on_farm_market/on_farm_marketJSON.json',
        ]

        for file_name in json_files:
            json_file_path = os.path.join(settings.BASE_DIR, file_name)

            with open(json_file_path, 'r') as file:
                try:
                    farms_data = json.load(file)
                except json.JSONDecodeError as e:
                    self.stdout.write(self.style.ERROR(f"Error loading {file_name}: {e}"))
                    continue

            for farm_data in farms_data:
                try:
                    if 'location_x' in farm_data and 'location_y' in farm_data:
                        location_x = float(farm_data['location_x']) if isinstance(farm_data['location_x'], str) else farm_data['location_x']
                        location_y = float(farm_data['location_y']) if isinstance(farm_data['location_y'], str) else farm_data['location_y']
                        location = Point(location_x, location_y, srid=4326)
                    else:
                        self.stdout.write(self.style.WARNING(f"Farm {farm_data['listing_name']} missing location data. Skipping."))
                        continue
                except (TypeError, ValueError):
                    self.stdout.write(self.style.ERROR(f"Error processing location data for farm {farm_data['listing_name']}. Skipping."))
                    continue

                # Check if location_address is present
                if not farm_data.get('location_address'):
                    self.stdout.write(self.style.WARNING(f"Farm {farm_data['listing_name']} missing location address. Skipping."))
                    continue

                # Check if farm already exists before creating
                existing_farm = Farm.objects.filter(
                    listing_name=farm_data['listing_name'],
                    location_address=farm_data['location_address']
                ).first()

                if existing_farm:
                    self.stdout.write(self.style.WARNING(f"Farm {farm_data['listing_name']} already exists. Skipping creation."))
                    continue

                # Create farm if it doesn't exist
                farm, created = Farm.objects.update_or_create(
                    listing_id=farm_data['listing_id'],
                    defaults={
                        'listing_name': farm_data['listing_name'],
                        'location_address': farm_data['location_address'],
                        'location': location,
                        'orgnization': farm_data['orgnization'],
                        'listing_desc': farm_data['listing_desc'],
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Successfully created farm: {farm.listing_name}'))
                else:
                    self.stdout.write(self.style.WARNING(f'Farm already exists and updated if necessary: {farm.listing_name}'))