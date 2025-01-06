from .settings import MAPBOX_ACCESS_TOKEN
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class MapboxTokenView(APIView):
    permission_classes = [IsAuthenticated]  # Optional: Limit access to authenticated users

    def get(self, request):
        return JsonResponse({"accessToken": MAPBOX_ACCESS_TOKEN})
