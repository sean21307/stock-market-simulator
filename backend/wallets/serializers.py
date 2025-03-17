from rest_framework import serializers

from wallets.models import Wallet, Share, Purchase, Sale


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'

class ShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Share
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ["symbol","quantity_purchased","price_per_share","total_price","date"]

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = ["symbol","quantity_sold","price_per_share","total_price","profit","date"]