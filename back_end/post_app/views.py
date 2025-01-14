from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.response import Response
from user_app.views import TokenReq
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_404_NOT_FOUND
from .models import UserPosts, UserSavedPosts
from .serializers import (
    UserPostSerializer, 
    AllUserSavedPostsSerializer, 
    UserSavedPostSerializer, 
    PostSerializer, 
    PostDetailSerializer,
    AllPostSerializer,
    UserPublicPostSerializer,
    )

from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from group_app.models import GroupMember
from django.db.models import Q




"""
Public-view of UserPosts Views
"""

#View to list all UserPosts based on location.
class AllPostsByLocationView(ListAPIView):
    serializer_class = AllPostSerializer

    def get_queryset(self):
        # Default location: Chicago, IL (latitude: 41.8781, longitude: -87.6298)
        default_location = Point(-87.6298, 41.8781, srid=4326)  # Set SRID for the default location

        # Get distance and user location from query params
        try:
            distance = float(self.request.query_params.get('distance', 50))  # Default to 50 km
        except ValueError:
            raise ValidationError({"error": "Invalid distance parameter. It must be a number."})

        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        
        # If lat and lng are provided, use them; otherwise, use the default location
        if lat and lng:
            try:
                user_location = Point(float(lng), float(lat), srid=4326)  # Set SRID for user-provided location
            except ValueError:
                raise ValidationError({"error": "Invalid latitude or longitude values."})
        else:
            user_location = default_location

        # Get the search query from request
        search_query = self.request.query_params.get('search', '').strip()

        # Base queryset for public and available posts within the distance
        queryset = UserPosts.objects.filter(
            is_public=True,
            is_available=True
        )

        # Exclude user's own posts if authenticated
        if self.request.user.is_authenticated:
            queryset = queryset.exclude(user=self.request.user)

        queryset = queryset.annotate(
            distance=Distance('location', user_location)
        ).filter(
            distance__lte=distance * 1000  # Convert km to meters
        )

        # If a search query is provided, filter based on title or description
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | Q(description__icontains=search_query)
            )

        return queryset.order_by('distance')
  

#View to retrieve a single UserPost by ID.
class SingleUserPostView(RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = UserPosts.objects.filter(is_public=True)  
    serializer_class = PostSerializer

#View for retrieving all posts from a single user
class AllPostsByUserView(ListAPIView):
    serializer_class = UserPublicPostSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')  # Get user_id from URL
        user_location = self.request.user.location  # Assuming user has a `location` field of type Point
        
        # Default to a Point if the user location is not set
        if not user_location:
            user_location = Point(0.0, 0.0)  # Replace with a valid default location if necessary
        
        return (
            UserPosts.objects.filter(user=user_id)
            .annotate(distance=Distance('location', user_location))  # Annotate with the distance
        )
"""
Private View of UserPosts for Users
"""

#Retrieves all of a users posts or allows a user to create a post
class AllUserPostsView(ListAPIView):
    serializer_class = UserPostSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserPosts.objects.filter(user=self.request.user)
    
    def post(self, request):
        serializer = UserPostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Explicitly associate the post with the authenticated user
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

#Allows users to get, update, or delete one of their posts based on it's id
class ManageUserPostView(TokenReq, APIView): 

    def get(self, request, post_id):
        try:
            post = UserPosts.objects.get(pk=post_id, user=request.user)
        except UserPosts.DoesNotExist:
            return Response({"error": "Post not found."}, status=HTTP_404_NOT_FOUND)
        
        serializer = UserPostSerializer(post)
        return Response(serializer.data, status=HTTP_200_OK)     

    def put(self, request, post_id):
        try:
            post = UserPosts.objects.get(pk=post_id, user=request.user)
        except UserPosts.DoesNotExist:
            return Response({"error": "Post not found."}, status=HTTP_404_NOT_FOUND)
        
        serializer = UserPostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    def patch(self, request, post_id):
        try:
            post = UserPosts.objects.get(pk=post_id, user=request.user)
        except UserPosts.DoesNotExist:
            return Response({"error": "Post not found."}, status=HTTP_404_NOT_FOUND)

        # Update specific fields
        serializer = UserPostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        try:
            post = get_object_or_404(UserPosts, pk=post_id, user=request.user)
        except UserPosts.DoesNotExist:
            return Response({"error": "Post not found."}, status=HTTP_404_NOT_FOUND)
        
        post.delete()
        return Response({"message": "Post deleted successfully."}, status=HTTP_200_OK)

"""
User Saved Post Views
"""

#Retrieves all of a users saved posts
# Allows a user to see all of their saved posts
class AllUserSavedPostsView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AllUserSavedPostsSerializer

    def get_queryset(self):
        # Return saved posts for the authenticated user
        return UserSavedPosts.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        # Pass the request to the serializer for distance calculation
        return {'request': self.request}


# Allows a user to save, delete, or view a specific saved post
class UserSavedPostView(TokenReq):

    # View details of a saved post
    def get(self, request, post_id):
        # Ensure the saved post belongs to the current user
        saved_post = get_object_or_404(UserSavedPosts, pk=post_id, user=request.user)
        serializer = UserSavedPostSerializer(saved_post)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Save a post to the user's saved posts
    def post(self, request, post_id):
        try:
            # Get the post to save
            post = get_object_or_404(UserPosts, pk=post_id)

            # Create or get the saved post
            saved_post, created = UserSavedPosts.objects.get_or_create(user=request.user, post=post)

            if created:
                return Response(
                    {"message": "Post added to saved posts successfully."},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {"message": "Post is already in saved posts."},
                    status=status.HTTP_200_OK
                )
        except UserPosts.DoesNotExist:
            return Response(
                {"error": "Post not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    # Remove a post from the user's saved posts
    def delete(self, request, post_id):
        try:
            post = get_object_or_404(UserPosts, pk=post_id)
            saved_post = get_object_or_404(UserSavedPosts, user=request.user, post=post)
            saved_post.delete()

            return Response(
                {"message": "Post removed from saved posts successfully."},
                status=status.HTTP_200_OK
            )
        except UserPosts.DoesNotExist:
            return Response(
                {"error": "Post not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except UserSavedPosts.DoesNotExist:
            return Response(
                {"error": "Post is not in your saved posts."},
                status=status.HTTP_400_BAD_REQUEST
            )

"""
Group Posts
"""

class AllGroupMemberUserPostsView(ListAPIView):
    serializer_class = AllPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the group ID from the URL
        group_id = self.kwargs.get('pk')

        # Get the authenticated user's location
        user = self.request.user
        if not user.location:
            raise ValidationError({"error": "User location is not set. Set User location in your profile settings."})

        # Ensure user location is a Point
        if not isinstance(user.location, Point):
            raise ValidationError({"error": "User location is invalid."})

        # Get group members
        group_members = GroupMember.objects.filter(group_id=group_id).values_list('user_id', flat=True)

        # Annotate distance and filter posts by group members
        return UserPosts.objects.filter(user_id__in=group_members).annotate(
            distance=Distance('location', user.location)
        )

