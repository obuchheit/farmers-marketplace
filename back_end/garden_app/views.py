from django.shortcuts import render
from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.status import HTTP_500_INTERNAL_SERVER_ERROR
import requests

"""Search for crop information.
TODO: When implementing on the front end ensure the argument takes proper format ie. lower-case-with-dashes
"""

class Crop(APIView): 
    def get(self, request, value):
        endpoint = f"https://openfarm.cc/api/v1/crops/?filter={value}"

        try:
            response = requests.get(endpoint)
            response.raise_for_status()

        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(response.json(), status=response.status_code)