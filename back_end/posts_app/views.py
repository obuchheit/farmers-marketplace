from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.filters import SearchFilter
from user_post_app.models import UserPosts
from user_post_app.serializers import UserPostSerializer

class UserPostsByLocationView(ListAPIView):
    """
    View to list all UserPosts based on location.
    """
    queryset = UserPosts.objects.filter(is_public=True, is_available=True)  # Only public and available posts
    serializer_class = UserPostSerializer
    filter_backends = [SearchFilter]
    search_fields = ['location']  # Allow filtering by location

class SingleUserPostView(RetrieveAPIView):
    """
    View to retrieve a single UserPost by ID.
    """
    queryset = UserPosts.objects.filter(is_public=True)  # Only public posts
    serializer_class = UserPostSerializer
