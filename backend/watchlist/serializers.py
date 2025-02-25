from rest_framework import serializers
from .models import Watchlist, WatchlistStock

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = ['id', 'name', 'description', 'user']

class WatchlistStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchlistStock
        fields = ['id', 'watchlist', 'symbol']
