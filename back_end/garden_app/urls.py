from .views import Crop, SingleCrop
from django.urls import path

urlpatterns = [
    path('crops/<str:value>/', Crop.as_view(), name='crop-search'),
    path('crops/single-crop/<str:id>/', SingleCrop.as_view(), name='crop-details')
]