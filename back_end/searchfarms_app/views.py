from django.shortcuts import render
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.http import JsonResponse
import requests
from .models import Farm

def geocode_city(city):
    api_key = 'C44937693B20C348AEB67B6A51649BCF'
    url = f'https://pcmiler.alk.com/apis/rest/v1.0/Service.svc/locations?query={city}&region=NA&apiKey={api_key}'
    response = requests.get(url)
    if response.status_code != 200:
        return None, f'Geocoding API error: {response.status_code} - {response.text}'
    data = response.json()
    if not data['Locations']:
        return None, 'City not found'
    location = data['Locations'][0]['Coords']
    return {'latitude': location['Lat'], 'longitude': location['Lon']}, None

def farms_within_radius(request):
    try:
        # Fetch user's latitude and longitude
        user_lat = float(request.GET.get('latitude', 37.7749))  # Default to San Francisco
        user_lon = float(request.GET.get('longitude', -122.4194))  # Default to San Francisco
        radius = float(request.GET.get('radius', 10))  # Default radius is 10 miles

        # Create user location point
        user_location = Point(user_lon, user_lat, srid=4326)

        # Find farms within the radius
        farms = (
            Farm.objects.annotate(distance=Distance('location', user_location))
            .filter(distance__lte=radius * 1609.34)  # Convert miles to meters
            .order_by('distance')  # Closest first
        )

        # Prepare response data
        farms_data = [
            {
                'listing_id': farm.listing_id,
                'listing_name': farm.listing_name,
                'location_address': farm.location_address,
                'location': {'lat': farm.location.y, 'lon': farm.location.x},
                'orgnization': farm.orgnization,
                'listing_desc': farm.listing_desc,
                'distance_mi': round(farm.distance.mi, 2),  # Distance in miles
            }
            for farm in farms
        ]

        return JsonResponse(farms_data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)