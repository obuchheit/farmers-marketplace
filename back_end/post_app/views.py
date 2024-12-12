from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.views import APIView
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
    PostDetailSerializer
    )

"""
Public-view of UserPosts Views
"""

#View to list all UserPosts based on location.
class AllPostsByLocationView(ListAPIView):
    queryset = UserPosts.objects.filter(is_public=True, is_available=True) 
    serializer_class = PostSerializer
    filter_backends = [SearchFilter]
    search_fields = ['location']  # Allow filtering by location

#View to retrieve a single UserPost by ID.
class SingleUserPostView(RetrieveAPIView):
    queryset = UserPosts.objects.filter(is_public=True)  
    serializer_class = PostDetailSerializer


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
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = UserPostSerializer(data=data)
        if serializer.is_valid():
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
    """
    Handles retrieving, adding, and removing saved posts for the authenticated user.
    """
    def get(self, request, post_id):
        """
        Retrieve a saved post detail for the authenticated user.
        """
        saved_post = get_object_or_404(UserSavedPosts, pk=post_id, user=request.user)
        serializer = UserSavedPostSerializer(saved_post)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, post_id):
        """
        Add a post to the user's saved posts.
        """
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

    def delete(self, request, post_id):
        """
        Remove a post from the user's saved posts.
        """
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



