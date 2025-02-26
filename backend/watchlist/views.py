from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Watchlist, WatchlistStock
from .serializers import WatchlistSerializer, WatchlistStockSerializer
from .constants import symbols_list

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watchlists(request):
    watchlists = Watchlist.objects.filter(user=request.user)
    watchlist_details = dict()
    for watchlist in watchlists:
        symbols = watchlist.items.values_list('symbol', flat=True)
        watchlist_details[watchlist.name] = symbols
    serializer = WatchlistSerializer(watchlists, many=True)
    return Response(watchlist_details, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_watchlist(request):
    watchlist = Watchlist.objects.create(
        name=request.data.get('name'), 
        description=request.data.get('description', ''),
        user=request.user
    )
    return Response(WatchlistSerializer(watchlist).data, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_watchlist(request, watchlist_name):
    watchlist = Watchlist.objects.get(name=watchlist_name)
    watchlist.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_stock_to_watchlist(request, watchlist_name, symbol):
    watchlist = get_object_or_404(Watchlist, name=watchlist_name, user=request.user)
    
    if symbol not in symbols_list:
        return Response({'error': 'Invalid or missing stock symbol.'}, status=status.HTTP_400_BAD_REQUEST)
    
    _, created = WatchlistStock.objects.get_or_create(watchlist=watchlist, symbol=symbol)
    return Response({'message': 'Stock added to watchlist.' if created else 'Stock already in watchlist.'}, 
                    status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_stock_from_watchlist(request, watchlist_name, symbol):
    stock = get_object_or_404(WatchlistStock, watchlist__name=watchlist_name, watchlist__user=request.user, symbol=symbol)
    stock.delete()
    return Response({'message': 'Stock removed from watchlist.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_watchlist_stocks(request, watchlist_name):
    watchlist = get_object_or_404(Watchlist, id=watchlist_name, user=request.user)
    stocks = WatchlistStockSerializer(watchlist.items.all(), many=True).data
    return Response({"stocks": stocks}, status=status.HTTP_200_OK)
