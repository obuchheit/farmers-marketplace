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
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'group_image', 'address', 'location', 'latitude', 'longitude', 'created_at', 'created_by']

    def get_latitude(self, obj):
        # Extract latitude from the location field
        if obj.location:
            return obj.location.y  # Latitude is stored as y in the Point object
        return None

    def get_longitude(self, obj):
        # Extract longitude from the location field
        if obj.location:
            return obj.location.x  # Longitude is stored as x in the Point object
        return None

  
#Detailed Public view of a single group
class GroupDetailSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'group_image', 'address', 'location', 'created_by', 'created_at', 'members', 'role']

    def get_members(self, obj):
        """
        Fetch all approved members for the group and serialize user details.
        """
        approved_members = GroupMember.objects.filter(group=obj, is_approved=True).select_related('user')
        return UserProfilePublicSerializer([member.user for member in approved_members], many=True).data

    def get_role(self, obj):
        """
        Fetch the role of the requesting user in the group.
        """
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
    group_name = serializers.CharField(source="group.name", read_only=True)
    invited_by_first_name = serializers.CharField(source="invited_by.first_name", read_only=True)
    invited_by_last_name = serializers.CharField(source="invited_by.last_name", read_only=True)
    invited_by_profile_picture = serializers.ImageField(source="invited_by.profile.picture", read_only=True)

    class Meta:
        model = Invitation
        fields = [
            "id",
            "group_name",
            "invited_by_first_name",
            "invited_by_last_name",
            "invited_by_profile_picture",
            "created_at",
        ]