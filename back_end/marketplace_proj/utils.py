import requests
import settings
from urllib.parse import quote


def get_coordinates_from_address(address):
    encoded_address = quote(address)  
       
    MAPBOX_ACCESS_TOKEN = settings.MAPBOX_ACCESS_TOKEN
    url = f"https://api.mapbox.com/search/geocode/v6/forward?q={encoded_address}"
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