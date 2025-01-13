from django.shortcuts import render
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.http import JsonResponse
from .models import Farm
from marketplace_proj.utils import get_coordinates_from_address  # Import the new function

def farms_within_radius(request):
    try:
        city = request.GET.get('city')
        radius = float(request.GET.get('radius', 10))  # Default radius is 10 miles

        if not city:
            return JsonResponse({'error': 'City parameter is required'}, status=400)

        # Use the new function to get coordinates
        latitude, longitude = get_coordinates_from_address(city)
        print(f"Geocoded coordinates for {city}: {latitude}, {longitude}")
        if latitude is None or longitude is None:
            return JsonResponse({'error': 'Could not geocode the city'}, status=400)

        # Create user location point
        user_location = Point(longitude, latitude, srid=4326)

        # Find farms within the radius
        farms = (
            Farm.objects.annotate(distance=Distance('location', user_location))
            .filter(distance__lte=radius * 1609.34)  # Convert miles to meters
            .order_by('distance')  # Closest first
        )
        print(f"Number of farms found: {farms.count()}")

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