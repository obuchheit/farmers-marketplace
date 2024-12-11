from django.shortcuts import render, get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.response import Response
from user_app.views import TokenReq
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_204_NO_CONTENT, HTTP_201_CREATED
from .serializers import AllUserSavedPostsSerializer, UserSavedPostSerializer
from .models import UserSavedPosts

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
