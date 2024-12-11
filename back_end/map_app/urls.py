from django.urls import path
from .views import Markets

urlpatterns = [
    path('food/', Markets.as_view(), name='usda_food_directory'),
]