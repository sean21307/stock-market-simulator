from rest_framework import serializers

from wallets.models import Wallet, Share, Purchase, Sale, Order


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'

class ShareSerializer(serializers.ModelSerializer):
    quantity = serializers.DecimalField(max_digits=15, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = Share
        fields = ['symbol','quantity', 'category']

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ["symbol","quantity_purchased","price_per_share","total_price","date"]

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = ["symbol","quantity_sold","price_per_share","total_price","profit","date"]

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'