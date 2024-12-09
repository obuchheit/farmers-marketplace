from django.contrib.auth import authenticate
from .models import AppUser
from .serializers import SignupSerializer
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

from django.contrib.auth import authenticate
from .models import AppUser
from .serializers import SignupSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

class SignupView(APIView):
    def post(self, request):
        # Validate incoming data
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            # Create user
            user = serializer.save()

            # Generate Token for the user
            token, created = Token.objects.get_or_create(user=user)

            # Authenticate the user
            authenticate_user = authenticate(username=user.email, password=request.data['password'])

            # Return token and user info (email) in response
            return Response(
                {
                    'message': 'User created successfully!',
                    'token': token.key,
                    'user': user.email,  
                },
                status=status.HTTP_201_CREATED,
            )

        # If serializer is not valid, return errors
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class SignIn(APIView):
    def post(self, request):
        data = request.data

        email = data.get('email')
        password = data.get('password')

        user = authenticate(username=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, 'user': user.email})

