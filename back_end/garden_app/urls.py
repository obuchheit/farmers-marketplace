from .views import Crop
from django.urls import path

urlpatterns = [
    path('crops/<str:value>', Crop.as_view(), name='crop-search')
]