from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken  # Import RefreshToken for blacklisting


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if username already exists
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already taken'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the user if username doesn't exist
    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def logout_user(request):
    try:
        refresh_token = request.data.get('refresh')  # Get the refresh token from the request body
        token = RefreshToken(refresh_token)  # Use RefreshToken to handle the refresh token
        token.blacklist()  # Blacklist the refresh token to invalidate it
        return Response({"message": "Logged out successfully!"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_all_users(request):
    try:
        users = User.objects.all()  # Retrieve all users from the User model
        user_data = [{"id": user.id, "username": user.username, "email": user.email} for user in users]
        
        return Response(user_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)