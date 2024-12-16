from rest_framework.serializers import ModelSerializer, ImageField, SerializerMethodField
from .models import UserPosts, UserSavedPosts
from user_app.models import User
from user_app.serializers import UserProfileSerializer


"""Serializer for Users to view or CRUD their own posts."""
class UserPostSerializer(ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    image = ImageField(use_url=True) # Ensures the full URL is included in the response

    class Meta:
        model = UserPosts
        fields = "__all__"
        extra_kwargs = {
            'image': {'required': False},
        }



"""Serializer for public view."""
class PostSerializer(ModelSerializer):
    user = SerializerMethodField()  # Customize what user data is exposed

    class Meta:
        model = UserPosts
        fields = ['id', 'user', 'image', 'title', 'description', 'address', 'time_posted', 'location']

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
