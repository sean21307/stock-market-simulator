from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Watchlist, WatchlistStock
from .serializers import WatchlistSerializer, WatchlistStockSerializer

# Get all watchlists for the authenticated user
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_watchlists(request):
    watchlists = Watchlist.objects.filter(user=request.user)
    serializer = WatchlistSerializer(watchlists, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Create a new watchlist
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_watchlist(request):
    name = request.data.get('name')
    description = request.data.get('description', '')
    user = request.user
    
    watchlist = Watchlist.objects.create(name=name, description=description, user=user)
    serializer = WatchlistSerializer(watchlist)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# Add a stock to a watchlist
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def add_stock_to_watchlist(request, watchlist_id):
    watchlist = get_object_or_404(Watchlist, id=watchlist_id, user=request.user)
    symbol = request.data.get('symbol')
    
    watchlist_stock, created = WatchlistStock.objects.get_or_create(watchlist=watchlist, symbol=symbol)
    
    if created:
        return Response({'message': 'Stock added to watchlist.'}, status=status.HTTP_201_CREATED)
    return Response({'message': 'Stock already in watchlist.'}, status=status.HTTP_200_OK)

# Remove a stock from a watchlist
@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def remove_stock_from_watchlist(request, watchlist_id, symbol):
    watchlist = get_object_or_404(Watchlist, id=watchlist_id, user=request.user)
    stock = get_object_or_404(WatchlistStock, watchlist=watchlist, symbol=symbol)
    stock.delete()
    return Response({'message': 'Stock removed from watchlist.'}, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def view_watchlist_stocks(request, watchlist_id):
    """
    View all stocks in a specific user's watchlist.
    """
    try:
        # Retrieve the watchlist by its ID, filtering by the logged-in user
        watchlist = Watchlist.objects.get(id=watchlist_id, user=request.user)

        # Get all the stocks associated with the watchlist
        stocks = watchlist.items.all()

        # Serialize the stocks
        serializer = WatchlistStockSerializer(stocks, many=True)

        return Response({"stocks": serializer.data}, status=status.HTTP_200_OK)
    except Watchlist.DoesNotExist:
        return Response({"error": "Watchlist not found or not associated with this user."}, status=status.HTTP_404_NOT_FOUND)
