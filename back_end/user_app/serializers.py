from rest_framework import serializers
from .models import AppUser

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['email', 'first_name', 'last_name', 'password', 'profile_picture', 'location', 'bio']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
        }

    def create(self, validated_data):
        user = AppUser.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            profile_picture=validated_data.get('profile_picture'),
            location=validated_data.get('location', '92039'),
            bio=validated_data.get('bio'),
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model: AppUser
        fields = ['first_name', 'last_name', 'profile_picture', 'location', 'bio']
        extra_kwargs = {
            'profile_picture': {'required': False, 'allow_null': True},
            'bio': {'required': False, 'allow_blank': True},
            'location': {'required': False},
        }

        def update(self, instance, validated_data):
            for attr, value in validated_data.items():
                setattr(instance, attr, value)

            instance.save()
            return instance