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
    AllPostSerializer
    )

from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from group_app.models import GroupMember



"""
Public-view of UserPosts Views
"""

#View to list all UserPosts based on location.
class AllPostsByLocationView(ListAPIView):
    serializer_class = AllPostSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the distance and user location from the request
        try:
            distance = float(self.request.query_params.get('distance', 50))  # Default to 50 km
        except ValueError:
            raise ValidationError({"error": "Invalid distance parameter. It must be a number."})
        
        user = self.request.user
        if not user.location:
            raise ValidationError({"error": "User location is not set. Set User location in your profile settings."})

        # Ensure user location is a Point
        if not isinstance(user.location, Point):
            raise ValidationError({"error": "User location is invalid."})

        # Filter posts within the specified distance
        user_location = user.location
        return UserPosts.objects.filter(
            is_public=True,
            is_available=True
        ).annotate(
            distance=Distance('location', user_location)
        ).filter(
            distance__lte=distance * 1000  # Convert km to meters
        ).order_by('distance')
  

#View to retrieve a single UserPost by ID.
class SingleUserPostView(RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = UserPosts.objects.filter(is_public=True)  
    serializer_class = PostSerializer


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
class ManageUserPostView(TokenReq): 

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
class AllUserSavedPostsView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AllUserSavedPostsSerializer

    def get_queryset(self):
        return UserSavedPosts.objects.filter(user=self.request.user)
    

#Allows a user to see a saved post in more detail or add or delete a saved post form their list.
class UserSavedPostView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    #Retrieve a saved post
    def get(self, request, post_id):

        saved_post = get_object_or_404(UserSavedPosts, pk=post_id, user=request.user)
        serializer = UserSavedPostSerializer(saved_post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    #Add a post to the user's saved posts.
    def post(self, request, post_id):
        try:
            post = UserPosts.objects.get(pk=post_id)
            saved_post, created = UserSavedPosts.objects.get_or_create(
                user=request.user,
                post=post
            )
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

    #Remove a post from the user's saved posts.
    def delete(self, request, post_id):
        try:
            post = UserPosts.objects.get(pk=post_id)
            saved_post = UserSavedPosts.objects.get(user=request.user, post=post)
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
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        group_id = self.kwargs.get('pk')

        group_members = GroupMember.objects.filter(group_id=group_id.values_list('user_id', flat=True))

        return UserPosts.objects.filter(user_id__in=group_members)



