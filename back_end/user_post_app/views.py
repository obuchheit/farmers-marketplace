from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, create
from rest_framework.response import Response
from user_app.views import TokenReq
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_204_NO_CONTENT, HTTP_201_CREATED
from .serializers import UserPostSerializer, AllUserSavedPostsSerializer, UserSavedPostSerializer
from .models import UserPosts, UserSavedPosts

class AllUserPostsView(ListAPIView, TokenReq):
    serializer_class = UserPostSerializer

    def get_queryset(self):
        pass


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



