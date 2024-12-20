from rest_framework import serializers
from .models import User, AdminProfile
from django.contrib.gis.geos import Point


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'profile_picture': {'required': False, 'allow_null': True},
            'bio': {'required': False, 'allow_blank': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            address=validated_data.get('address'),
        )
        user.profile_picture = validated_data.get('profile_picture') or 'profile_pictures/default_profile_picture.jpg'
        user.bio = validated_data.get('bio')

        
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'profile_picture', 'address', 'bio', 'password']
        extra_kwargs = {
            'email': {'read_only': True},  # Prevent users from updating their email
        }

class UserProfilePublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture', 'address', 'bio']
        extra_kwargs = {
            'id': {'read_only': True},
            'email': {'read_only': True},
            'first_name': {'read_only': True},  
            'last_name': {'read_only': True},
            'profile_picture': {'read_only': True},
            'bio': {'read_only': True},
            'address': {'read_only': True},
        }

class AdminProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for admin-specific profile.
    """
    class Meta:
        model = AdminProfile
        fields = ['admin_role', 'permissions']


    
