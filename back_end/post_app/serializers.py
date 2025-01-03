from rest_framework.serializers import ModelSerializer, ImageField, SerializerMethodField
from .models import UserPosts, UserSavedPosts
from user_app.models import User
from user_app.views import TokenReq
from user_app.serializers import UserProfileSerializer
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point


"""Serializer for Users to view or CRUD their own posts."""
class UserPostSerializer(ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    image = ImageField(use_url=True, required=False, allow_null=True) # Ensures the full URL is included in the response

    class Meta:
        model = UserPosts
        fields = "__all__"
        extra_kwargs = {
            'user': {'required': False}, # Allow the view to set this field programmatically
            'image': {'required': False, 'allow_null': True},
        }
        
    def validate_image(self, value):
        # Allow missing or null image
        if not value:
            return None
        return value

    def create(self, validated_data):
        if 'image' not in validated_data or not validated_data['image']:
            validated_data['image'] = 'post_images/default_post_image.jpg'

        user = self.context['request'].user
        return UserPosts.objects.create(user=user, **validated_data)


"""Serializer for public view."""
class PostSerializer(ModelSerializer):
    user = SerializerMethodField()  # Customize what user data is exposed
    distance = SerializerMethodField()  # Include distance in the response

    class Meta:
        model = UserPosts
        fields = [
            'id', 'user', 'image', 'title', 'description', 'address', 
            'time_posted', 'location', 'is_available', 'is_public', 'distance'
        ]

    def get_user(self, obj):
        # Expose only limited user information (e.g., name and profile picture)
        return {
            "id": obj.user.id,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
            "profile_picture": f'http://localhost:8000{obj.user.profile_picture.url}' if obj.user.profile_picture else None
        }

    def get_distance(self, obj):
        # Ensure distance is included in the queryset
        if hasattr(obj, 'distance'):
            return round(obj.distance.km, 2)
        return None

    
class AllPostSerializer(ModelSerializer):
    image = ImageField(use_url=True) # Ensures the full URL is included in the response
    distance = SerializerMethodField()

    class Meta:
        model = UserPosts
        fields = ['id', 'image', 'title', 'address', 'distance']
        extra_kwargs = {
            'image': {'required': False},
        }
    
    def get_distance(self, obj):
        distance = round(obj.distance.km, 2)
        return distance



'''Saved Post Serializers'''
# Serializer for common post-related fields
class PostDetailSerializer(ModelSerializer):

    class Meta:
        model = UserPosts
        fields = ['id', 'image', 'title', 'address']  # Limited fields for saved posts



class AllUserSavedPostsSerializer(ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    post_details = PostDetailSerializer(source='post', read_only=True)

    class Meta:
        model = UserSavedPosts
        fields = ['id', 'user', 'post_details', 'saved_at']



class UserSavedPostSerializer(ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    post_details = PostDetailSerializer(source='post', read_only=True)

    class Meta:
        model = UserSavedPosts
        fields = ['id', 'user', 'post_details', 'saved_at']
