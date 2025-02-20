from rest_framework import serializers

from stocks.models import Stock


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['symbol_id','name','description']

