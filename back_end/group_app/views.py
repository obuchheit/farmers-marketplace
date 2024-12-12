from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .models import Group, GroupMember, JoinRequest
from user_app.models import User
from .serializers import GroupSerializer, GroupDetailSerializer, GroupMemberSerializer, JoinRequestSerializer
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsMemberOfGroup, IsGroupCreatorOrAdmin
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_204_NO_CONTENT

class GroupCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class GroupDetailView(APIView):
    permission_classes = [IsAuthenticated, IsGroupCreatorOrAdmin]

    def get(self, request, pk):
        group = get_object_or_404(Group, pk=pk)
        if group.created_by != request.user and not group.members.filter(user=request.user, role='admin').exists():
            return Response({"detail": "You don't have permission to view this group."}, status=HTTP_403_FORBIDDEN)
        
        serializer = GroupDetailSerializer(group)
        return Response(serializer.data)

    def put(self, request, pk):
        group = get_object_or_404(Group, pk=pk)
        if group.created_by != request.user:
            return Response({"detail": "Only the group creator can update this group."}, status=HTTP_403_FORBIDDEN)

        serializer = GroupSerializer(group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        group = get_object_or_404(Group, pk=pk)
        if group.created_by != request.user:
            return Response({"detail": "Only the group creator can delete this group."}, status=HTTP_403_FORBIDDEN)
        
        group.delete()
        return Response(status=HTTP_204_NO_CONTENT)