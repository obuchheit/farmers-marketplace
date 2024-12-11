from django.shortcuts import render
from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.status import HTTP_500_INTERNAL_SERVER_ERROR
import requests
from .utils import format_request_string

"""Search for crop information."""

class Crop(APIView): 
    def get(self, request):
        formatted_request = format_request_string(request)
        endpoint = f"https://www.openfarm.cc/api/v1/crops/?filter={formatted_request}"

        try:
            response = requests.get(endpoint)
            response.raise_for_status()

        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(response.json(), status=response.status_code)