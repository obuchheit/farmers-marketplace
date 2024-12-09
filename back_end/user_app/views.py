from django.contrib.auth import authenticate
from .models import AppUser
from .serializers import SignupSerializer, UserProfileSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_204_NO_CONTENT
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class TokenReq(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


class Signup(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            
            return Response(
                {
                    'message': 'User created successfully!',
                    'token': token.key,
                    'user': user.email,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class SignIn(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(username=email, password=password)

        if not email or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=email, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                'user': user.email
            })

        return Response(
            {"detail": "Invalid credentials"},
            status=HTTP_400_BAD_REQUEST,
        )
        
        
class SignOut(TokenReq):
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=HTTP_204_NO_CONTENT)
    


class UserProfile(TokenReq):
    def get(self, request):
        user = request.user

        profile_data = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "profile_picture": user.profile_picture.url if user.profile_picture else None,
            "location": user.location,
            "bio": user.bio,
        }

        return Response(profile_data)


class UpdateUserProfile(TokenReq):
    def put(self, request):
        user = request.user
        data = request.data

        serializer = UserProfileSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)