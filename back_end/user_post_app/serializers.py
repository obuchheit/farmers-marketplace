from rest_framework import serializers
from .models import UserPosts, UserSavedPosts
from user_app.models import User
from user_app.serializers import UserProfileSerializer

# Serializer for common post-related fields
class PostDetailSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)
    title = serializers.CharField(read_only=True)
    location = serializers.CharField(read_only=True)
    is_available = serializers.BooleanField(read_only=True)
    description = serializers.CharField(read_only=True)
    time_posted = serializers.DateTimeField(read_only=True)

    class Meta:
        model = UserPosts
        fields = ['image', 'title', 'location', 'is_available', 'description', 'time_posted']

# Serializer for All User Saved Posts (showing User B saving posts by others)
class AllUserSavedPostsSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)  # User B, who saved the post
    post_details = PostDetailSerializer(source='post', read_only=True)  # Details of the post saved by User B

    class Meta:
        model = UserSavedPosts
        fields = ['id', 'user', 'post_details', 'saved_at']

# Serializer for Individual User Saved Post (showing User B saving others' posts)
class UserSavedPostSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)  # User B, who saved the post
    post_details = PostDetailSerializer(source='post', read_only=True)  # Details of the post saved by User B

    class Meta:
        model = UserSavedPosts
        fields = ['id', 'user', 'post_details', 'saved_at']
