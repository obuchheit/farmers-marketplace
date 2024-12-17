from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_204_NO_CONTENT, HTTP_200_OK
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User, AdminProfile
from .serializers import SignupSerializer, UserProfileSerializer, AdminProfileSerializer

class TokenReq(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

class SignupView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "message": "User created successfully!",
                "token": token.key,
                "user": serializer.data,
            }, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

class SignInView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=HTTP_400_BAD_REQUEST)

        user = authenticate(username=email, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Login successful!",
                "token": token.key,
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                },
            }, status=HTTP_201_CREATED)
        return Response({"detail": "Invalid credentials."}, status=HTTP_400_BAD_REQUEST)

class SignOutView(TokenReq):
    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully."}, status=HTTP_204_NO_CONTENT)


class UserProfileView(TokenReq):
    def get(self, request):
        return Response({"email": request.user.email})


class UpdateUserProfileView(RetrieveUpdateDestroyAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        return self.request.user
    
    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({"message": "User Profile deleted successfully."}, status=HTTP_204_NO_CONTENT)



class AdminProfileView(TokenReq):
    def get(self, request):
        try:
            admin_profile = request.user.admin_profile
            serializer = AdminProfileSerializer(admin_profile)
            return Response(serializer.data)
        except AdminProfile.DoesNotExist:
            return Response({"detail": "Admin profile not found."}, status=HTTP_400_BAD_REQUEST)

class UpdateAdminProfileView(RetrieveUpdateDestroyAPIView):
    serializer_class = AdminProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        return self.request.user.admin_profile
    

