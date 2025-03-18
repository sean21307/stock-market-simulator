from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth_token(request, format=None):
    content = {
        'user' : str(request.user),
        'token' : str(request.auth)
    }

    return Response(content, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
    }, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def put_user_profile(request):
    user = request.user
    new_username = request.data.get("username")
    new_email = request.data.get("email")

    if not new_username or not new_email:
        return Response({"error": "Both username and email are required for a full update"},
                        status=status.HTTP_400_BAD_REQUEST)

    if new_email != user.email and User.objects.filter(email=new_email).exists():
        return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)

    if new_username != user.username and User.objects.filter(username=new_username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    user.username = new_username
    user.email = new_email
    user.save()

    return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def patch_user_profile(request):
    user = request.user
    new_username = request.data.get("username", user.username)
    new_email = request.data.get("email", user.email)

    if new_email != user.email and User.objects.filter(email=new_email).exists():
        return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)

    if new_username != user.username and User.objects.filter(username=new_username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    user.username = new_username
    user.email = new_email
    user.save()

    return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)