from rest_framework import serializers
from .models import User, AdminProfile

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'profile_picture', 'location', 'bio']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'profile_picture': {'required': False, 'allow_null': True},
            'location': {'required': False},
            'bio': {'required': False, 'allow_blank': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name')
        )
        user.profile_picture = validated_data.get('profile_picture')
        user.location = validated_data.get('location', '92039')
        user.bio = validated_data.get('bio')
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile management.
    """
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'profile_picture', 'location', 'bio']
        extra_kwargs = {
            'profile_picture': {'required': False, 'allow_null': True},
            'bio': {'required': False, 'allow_blank': True},
            'location': {'required': False},
        }

class AdminProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for admin-specific profile.
    """
    class Meta:
        model = AdminProfile
        fields = ['admin_role', 'permissions']


    
