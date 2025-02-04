from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .models import Group, GroupMember, JoinRequest, Invitation, Notification
from rest_framework.exceptions import ValidationError
from user_app.models import User
from .serializers import GroupSerializer, GroupDetailSerializer, GroupMemberSerializer, JoinRequestSerializer, InvitationSerializer, GroupListSerializer
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsMemberOfGroup, IsGroupCreatorOrAdmin
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import PermissionDenied

from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_204_NO_CONTENT
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance



"""
Group Views
"""
#Any user can Create a group
class GroupCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    
    def post(self, request, *args, **kwargs):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            # Save the group with the current user as the creator
            group = serializer.save(created_by=request.user)

            # Add the creator as a member of the group with an admin role
            GroupMember.objects.create(
                group=group,
                user=request.user,
                role='admin',  # Or another role that suits your logic
                is_approved=True
            )

            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

#User's groups list view
class UserGroupsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GroupListSerializer

    def get_queryset(self):
        user = self.request.user
        # Retrieve all groups where the user is an approved member
        group_ids = GroupMember.objects.filter(user=user, is_approved=True).values_list('group', flat=True)
        return Group.objects.filter(id__in=group_ids)

#Only a Group member can see details of a group
#Only the Group Creator can PUT or DEL a group
class GroupDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupDetailSerializer
    permission_classes = [IsAuthenticated]

    def check_permissions(self, request):
        """
        Custom permission logic to handle role-based access.
        """
        group = get_object_or_404(Group, pk=self.kwargs['pk'])

        if request.method == 'GET':
            # Allow if the user is a member or an admin
            if not group.members.filter(user=request.user, is_approved=True).exists():
                raise PermissionDenied("You don't have permission to view this group.")

        elif request.method in ['PUT', 'PATCH', 'DELETE']:
            # Allow only admins to update or delete
            if not group.members.filter(user=request.user, role='admin', is_approved=True).exists():
                raise PermissionDenied("Only admins can update or delete this group.")

        super().check_permissions(request)

    def update(self, request, *args, **kwargs):
        """
        Override update to use a different serializer for updates.
        """
        group = self.get_object()
        serializer = GroupSerializer(group, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    """
    Join Request Views
    """

#Any user can request to join a group
class JoinRequestCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

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

#Join Requests View
class GroupJoinRequestsView(ListAPIView):
    permission_classes = [IsAuthenticated, IsGroupCreatorOrAdmin]
    serializer_class = JoinRequestSerializer

    def get_queryset(self):
        group_id = self.kwargs['pk']  # Retrieve the group ID from the URL
        return JoinRequest.objects.filter(group_id=group_id, is_approved=False)

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
    serializer_class = GroupSerializer

    def get_queryset(self):
        try: 
            distance = float(self.request.query_params.get('distance', 10))
        except ValueError:
            raise ValidationError({"error": "Invalid distance parameter. It must be a number."})

        search = self.request.query_params.get('search', '').strip()
        user = self.request.user

        if not user.location:
            raise ValidationError({"error": "User location is not set. Set User location in your profile settings."})

        if not isinstance(user.location, Point):
            raise ValidationError({"error": "User location is invalid."})
        
        user_location = user.location

        queryset = Group.objects.filter().annotate(
            distance=Distance('location', user_location)
        ).filter(
            distance__lte=distance * 1000
        ).order_by('distance')

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


#Detailed View of group for non group members
class GroupDetailPublicView(RetrieveAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupDetailSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        group = self.kwargs['pk']
        print(group)
        return Group.objects.filter(id=group)
    
    
"""
Invitaiton Views
"""

class ListInvitationsView(ListAPIView):
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Invitation.objects.filter(invitee=self.request.user)

class InviteMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        group_id = request.data.get('group')
        invitee_id = request.data.get('invitee')

        group = get_object_or_404(Group, id=group_id)
        invitee = get_object_or_404(User, id=invitee_id)
        invited_by = request.user

        # Check if the invited_by user is a member of the group
        if not group.members.filter(user=invited_by, is_approved=True).exists():
            return Response({"detail": "You are not a member of this group."}, status=HTTP_403_FORBIDDEN)

        # Check if invitee is already a member
        if group.members.filter(user=invitee).exists():
            return Response({"detail": "User is already a member of this group."}, status=HTTP_400_BAD_REQUEST)

        # Create invitation
        invitation, created = Invitation.objects.get_or_create(
            group=group, invitee=invitee,
            defaults={'invited_by': invited_by},
        )

        if not created:
            return Response({"detail": "Invitation already exists."}, status=HTTP_400_BAD_REQUEST)

        return Response(InvitationSerializer(invitation).data, status=HTTP_201_CREATED)
    

class AcceptInvitationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        invitation = get_object_or_404(Invitation, id=pk, invitee=request.user)
        
        # Check if the invitation is still pending
        if invitation.status != 'pending':
            return Response({"detail": "This invitation is no longer valid."}, status=HTTP_400_BAD_REQUEST)

        invitation.status = 'accepted'
        invitation.save()

        # Check if the inviter is an admin
        inviter_is_admin = invitation.group.members.filter(user=invitation.invited_by, role='admin').exists()
        
        # Automatically approve the invitee if the inviter is an admin
        GroupMember.objects.create(
            group=invitation.group,
            user=request.user,
            role='member',
            is_approved=inviter_is_admin
        )

        return Response({"detail": "Invitation accepted."}, status=HTTP_200_OK)
    

class RejectInvitationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        invitation = get_object_or_404(Invitation, id=pk, invitee=request.user)

        # Check if the invitation is still pending
        if invitation.status != 'pending':
            return Response({"detail": "This invitation is no longer valid."}, status=HTTP_400_BAD_REQUEST)

        invitation.status = 'rejected'
        invitation.save()

        return Response({"detail": "Invitation rejected."}, status=HTTP_200_OK)



"""
Notification Views
"""

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user, is_read=False)
        data = [
            {
                "id": notification.id,
                "message": notification.message,
                "created_at": notification.created_at,
                "is_read": notification.is_read,
            }
            for notification in notifications
        ]
        return Response(data)

class MarkNotificationAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        notification = Notification.objects.filter(id=pk, user=request.user).first()
        if not notification:
            return Response({"detail": "Notification not found."}, status=404)
        notification.is_read = True
        notification.save()
        return Response({"detail": "Notification marked as read."})