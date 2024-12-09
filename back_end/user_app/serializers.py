from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import AppUser  # Import the custom user model

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = get_user_model()  # AppUser model
        fields = ['email', 'first_name', 'last_name', 'password', 'profile_picture', 'location', 'bio']
    
    def create(self, validated_data):
        user = get_user_model()(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user