from django.contrib.auth import authenticate, login, logout
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

class SignUp(APIView):
    def post(self, request, *args, **kwargs):
        data = SignupSerializer(data=request.data)

        if data.is_valid():
            user = data.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'message': "Signup successful!",
                'user': data.data,
                'token': token.key,
            }, status= HTTP_201_CREATED)
        
        return Response(data.errors, status=HTTP_400_BAD_REQUEST)
