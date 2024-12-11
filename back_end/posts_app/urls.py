from django.urls import path
from .views import UserPostsByLocationView, SingleUserPostView

urlpatterns = [
    path('', UserPostsByLocationView.as_view(), name='all-posts-by-query'),
    path('<int:pk>', SingleUserPostView.as_view(), name='single-post')
]