from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, create
from rest_framework.response import Response
from user_app.views import TokenReq
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_404_NOT_FOUND
from .serializers import UserPostSerializer, AllUserSavedPostsSerializer, UserSavedPostSerializer
from .models import UserPosts, UserSavedPosts

"""Retrieves all of a users  posts"""
class AllUserPostsView(ListAPIView, TokenReq):
    serializer_class = UserPostSerializer

    def get_queryset(self):
        return UserPosts.objects.filter(user=self.request.user)
    
"""Allows users to CRUD one of their posts based on it's id"""
class ManageUserPostView(TokenReq):
    
    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = UserPostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        

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


"""Returns all of a User's Saved Posts"""
class AllUserSavedPostsView(ListAPIView, TokenReq):
    serializer_class = AllUserSavedPostsSerializer

    def get_queryset(self):
        return UserSavedPosts.objects.filter(user=self.request.user)
    

"""
Retrieves a single User Saved Post. 
Will automatically expect a primary key as a parameter in the URL
"""
class UserSavedPostDetailView(RetrieveAPIView, TokenReq):
    serializer_class = UserSavedPostSerializer

    def get_queryset(self):
        return UserSavedPosts.objects.filter(user=self.request.user)

    def get_object(self):
        obj = super().get_object()

        if obj.user != self.request.user:
            raise PermissionDenied("You do not have permission to view this saved post.")
        return obj
    
"""Add or delete another users post from the authenticated user's saved posts"""
class UserSavedPostsCreateDeleteView(TokenReq):

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



