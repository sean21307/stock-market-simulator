from rest_framework import serializers

from stocks.models import Stock, EndOfDay


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['symbol_id','name','description']

class EndOfDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = EndOfDay
        fields = '__all__'
