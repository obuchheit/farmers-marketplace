from django.urls import path
from .views import farms_within_radius

urlpatterns = [
    path('farms_within_radius/', farms_within_radius, name='farms_within_radius'),
]

# test test