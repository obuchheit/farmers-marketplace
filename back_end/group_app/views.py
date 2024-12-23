from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .models import Group, GroupMember, JoinRequest
from rest_framework.exceptions import ValidationError
from user_app.models import User
from .serializers import GroupSerializer, GroupDetailSerializer, GroupMemberSerializer, JoinRequestSerializer
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsMemberOfGroup, IsGroupCreatorOrAdmin
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_204_NO_CONTENT
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance



"""
Group Views
"""
#Any user can Create a group
class GroupCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


#Only a Group member can see details of a group
#Only the Group Creator can PUT or DEL a group
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
    
    """
    Join Request Views
    """

#Any user can request to join a group
class JoinRequestCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        group_id = request.data.get('group')
        group = get_object_or_404(Group, id=group_id)
        user = request.user

        # Ensure the user is not already a member of the group
        if group.members.filter(user=user).exists():
            return Response({"detail": "You are already a member of this group."}, status=HTTP_400_BAD_REQUEST)
        
        # Create the join request
        join_request = JoinRequest.objects.create(group=group, user=user)
        return Response(JoinRequestSerializer(join_request).data, status=HTTP_201_CREATED)

#Only a Group Admin can approve a request
class JoinRequestApproveView(APIView):
    permission_classes = [IsAuthenticated, IsGroupCreatorOrAdmin]

    def post(self, request, pk):
        join_request = get_object_or_404(JoinRequest, pk=pk)
        group = join_request.group
        user = join_request.user

        # Approve the request and add the user to the group
        join_request.is_approved = True
        join_request.save()

        GroupMember.objects.create(group=group, user=user, role='member', is_approved=True)

        # Delete the join request after approval
        join_request.delete()

        return Response({"detail": "Join request approved and user added to group."}, status=HTTP_200_OK)

#Only a group admin can deny a request
class JoinRequestDenyView(APIView):
    permission_classes = [IsAuthenticated, IsGroupCreatorOrAdmin]

    def post(self, request, pk):
        join_request = get_object_or_404(JoinRequest, pk=pk)
        join_request.delete()
        return Response({"detail": "Join request denied."}, status=HTTP_204_NO_CONTENT)
    

"""
Group Public Views
"""
#List of all Groups
class GroupListView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get_queryset(self):
        try: 
            distance = float(self.request.queryparams.get('distance', 10))
        except ValueError:
            raise ValidationError({"error": "Invalid distance parameter. It must be a number."})

        user = self.request.user
        if not user.location:
            raise ValidationError({"error": "User location is not set. Set User location in your profile settings."})

        if not isinstance(user.location, Point):
            raise ValidationError({"error": "User location is invalid."})
        
        user_location = user.location

        return Group.objects.filter().annotate(
            distance=Distance('location', user_location)
        ).filter(
            distance__lte=distance * 1000
        ).order_by('distance')

#Detailed View of group for non group members
class GroupDetailPublicView(RetrieveAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupDetailSerializer
    permission_classes = [IsAuthenticated, IsMemberOfGroup]

    def get_queryset(self):
        group = self.kwargs['pk']
        user = self.request.user
        if not GroupMember.objects.filter(group_id=group, user=user, is_approved=True).exists():
            return Group.objects.none()  # Return no groups if the user is not a member or approved
        return Group.objects.filter(id=group)