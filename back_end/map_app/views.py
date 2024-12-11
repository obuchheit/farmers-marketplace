import requests
from requests_oauthlib import OAuth1
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

class Markets(APIView):
    def get(self, request):
        api_key = settings.USDA_API_KEY
        
        endpoint = f"https://www.usdalocalfoodportal.com/api/farmersmarket/?apikey={api_key}&zip=63084&radius=10"

        try:
            response = requests.get(endpoint)
            response.raise_for_status()

        except requests.exceptions.RequestException as e: 
            print(f"Request error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(response.json(), status=response.status_code)
