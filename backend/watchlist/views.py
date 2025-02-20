from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Watchlist
from stocks.models import Stock
from .serializers import WatchlistSerializer

class WatchlistViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Get the authenticated user's watchlist."""
        watchlist, _ = Watchlist.objects.get_or_create(user=request.user)
        serializer = WatchlistSerializer(watchlist)
        return Response(serializer.data)

    def get_by_username(self, request, username):
        """Get the watchlist of a specific user by username."""
        try:
            user = User.objects.get(username=username)
            watchlist, _ = Watchlist.objects.get_or_create(user=user)
            serializer = WatchlistSerializer(watchlist)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
