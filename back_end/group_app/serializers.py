# serializers.py

from rest_framework import serializers
from .models import Group, GroupMember, JoinRequest, Invitation
from user_app.models import User
from django.contrib.auth import get_user_model
from user_app.serializers import UserProfilePublicSerializer
#Serializer for a user's groups
class GroupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'group_image', 'created_at']

#Serializer for member details on the Group Pages
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']

#Serializer for Public view of listed groups
class GroupSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.email')  # Only show the email of the creator


    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'group_image', 'address', 'location', 'created_at', 'created_by']


  
#Detailed Public view of a single group
class GroupDetailSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()


    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'group_image', 'address', 'location', 'created_by', 'created_at', 'members', 'role']

    def get_members(self, obj):
        members = GroupMember.objects.filter(group=obj, is_approved=True)
        return UserProfilePublicSerializer(members.values('user'), many=True).data
    
    def get_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            group_member = GroupMember.objects.filter(group=obj, user=request.user).first()
            if group_member:
                return group_member.role  
        return None  



class JoinRequestSerializer(serializers.ModelSerializer):
    user = UserProfilePublicSerializer(read_only=True)

    class Meta:
        model = JoinRequest
        fields = ['id', 'group', 'user', 'request_date', 'is_approved']


class GroupMemberSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = GroupMember
        fields = ['user', 'role', 'is_approved']


#Invitaiton Serializer
class InvitationSerializer(serializers.ModelSerializer):
    invited_by = serializers.ReadOnlyField(source='invited_by.email')
    group_name = serializers.ReadOnlyField(source='group.name')

    class Meta:
        model = Invitation
        fields = ['id', 'group', 'invited_by', 'invitee', 'status', 'created_at', 'group_name']
