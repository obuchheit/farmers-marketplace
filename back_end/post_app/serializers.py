from rest_framework.serializers import ModelSerializer, ImageField, SerializerMethodField
from .models import UserPosts, UserSavedPosts
from user_app.models import User
from user_app.views import TokenReq
from user_app.serializers import UserProfileSerializer


"""Serializer for Users to view or CRUD their own posts."""
class UserPostSerializer(ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    image = ImageField(use_url=True) # Ensures the full URL is included in the response

    class Meta:
        model = UserPosts
        fields = "__all__"
        extra_kwargs = {
            'user': {'required': False}, # Allow the view to set this field programmatically
            'image': {'required': False},
        }

    def create(self, validated_data):
        # Ensure the user is set during post creation
        user = self.context['request'].user
        return UserPosts.objects.create(user=user, **validated_data)


"""Serializer for public view."""
class PostSerializer(ModelSerializer):

    user = SerializerMethodField()  # Customize what user data is exposed

    class Meta:
        model = UserPosts
        fields = ['id', 'user', 'image', 'title', 'description', 'address', 'time_posted', 'location', 'is_available', 'is_public']

    def get_user(self, obj):
        # Expose only limited user information (e.g., name and profile picture)
        return {
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
            "profile_picture": obj.user.profile_picture.url if obj.user.profile_picture else None
        }
    
class AllPostSerializer(ModelSerializer):
    user = SerializerMethodField()  
    image = ImageField(use_url=True) # Ensures the full URL is included in the response

    class Meta:
        model = UserPosts
        fields = ['user', 'image', 'title', 'location']
        extra_kwargs = {
            'image': {'required': False},
        }
    def get_user(self, obj):
        # Return limited user information for public access
        return {
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
        }


'''Saved Post Serializers'''
# Serializer for common post-related fields
class PostDetailSerializer(ModelSerializer):
    class Meta:
        model = UserPosts
        fields = ['image', 'title', 'location']  # Limited fields for saved posts

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
