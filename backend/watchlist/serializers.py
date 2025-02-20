from rest_framework import serializers
from .models import Watchlist
from stocks.models import Stock

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['symbol_id', 'name', 'description']

class WatchlistSerializer(serializers.ModelSerializer):
    stocks = StockSerializer(many=True, read_only=True)

    class Meta:
        model = Watchlist
        fields = ['stocks']
