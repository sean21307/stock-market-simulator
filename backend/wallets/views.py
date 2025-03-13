import decimal
import json

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Profile
from wallets.models import Wallet, WalletValue


import os
from dotenv import load_dotenv
import fmpsdk

from wallets.serializers import WalletSerializer, ShareSerializer, PurchaseSerializer, SaleSerializer

load_dotenv()
apikey = os.environ.get("API_KEY")

@permission_classes([IsAuthenticated])
@api_view(["GET"])
def get_wallets(request):
    wallet_owner_username = request.user
    user = User.objects.get(username=wallet_owner_username)
    wallets = user.wallet_set.all()
    wallet_list = []
    for wallet in wallets:
        wallet_list.append(WalletSerializer(wallet).data)
    return Response(wallet_list, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_wallet(request):
    wallet_owner_username = request.user
    user = User.objects.get(username=wallet_owner_username)
    try:
        wallet = user.wallet_set.create(name=request.data.get('name'), description=request.data.get('description'), balance = 100000.00)
        return Response(WalletSerializer(wallet).data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['PUT'])
def update_wallet(request, wallet_name):
    try:
        wallet_owner_username = request.user
        user = User.objects.get(username=wallet_owner_username)
        wallet = user.wallet_set.get(name=wallet_name)

        wallet.name = request.data.get('name')
        wallet.description = request.data.get('description')
        wallet.save()
        return Response({'wallet': WalletSerializer(wallet).data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_wallet(request, wallet_name):
    try:
        wallet_owner_username = request.user
        user = User.objects.get(username=wallet_owner_username)
        wallet = user.wallet_set.get(name=wallet_name)
        wallet.delete()
        return Response( status=status.HTTP_200_OK)
    except Exception as e:
        return Response( {'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def add_shares(request, wallet_name):
    if not request.user.is_authenticated:
        return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        symbol = request.data.get('symbol')
        quantity = int(request.data.get('quantity')) # ensure only int quantities

        price = fmpsdk.quote_short(apikey=apikey,symbol=symbol)[0]['price']
        total_price = decimal.Decimal(price * quantity)
        wallet_owner_username = request.user

        user = User.objects.get(username=wallet_owner_username)
        wallet = user.wallet_set.get(name=wallet_name)
        wallet.balance = wallet.balance - total_price
        if wallet.balance < 0:
            return Response({'error': 'Transaction would make wallet Balance negative'}, status=status.HTTP_400_BAD_REQUEST)
        wallet.save()

        shares = [
            wallet.share_set.model(symbol=symbol, buying_price=price, wallet=wallet)
            for _ in range(quantity)
        ]

        wallet.share_set.bulk_create(shares)
        wallet.purchase_set.create(
            symbol=symbol,
            quantity_purchased=quantity,
            quantity_available=quantity,
            price_per_share=price,
            total_price= price * quantity,
        )
        update_wallet_value(wallet)

        return Response({'wallet': WalletSerializer(wallet).data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def sell_shares(request, wallet_name):
    try:
        symbol = request.data.get('symbol')
        quantity = request.data.get('quantity')
        price = fmpsdk.quote_short(apikey=apikey,symbol=symbol)[0]['price']
        total_price = decimal.Decimal(price * quantity)
        wallet_owner_username = request.user
        user = User.objects.get(username=wallet_owner_username)
        wallet = user.wallet_set.get(name=wallet_name)
        wallet.balance += total_price
   
        ids_to_delete = list(
            wallet.share_set.filter(symbol=symbol)
            .order_by('id')[:quantity]
            .values_list('id', flat=True)  
        )

        wallet_purchases = list(wallet.purchase_set.filter(symbol=symbol, quantity_available__gt=0).order_by('date'))
        index = 0
        total_purchase_price = 0
        number_of_shares = quantity
        while quantity > 0:
            current = wallet_purchases[index]
            if current.quantity_available > quantity:
                current.quantity_available -= quantity
                total_purchase_price += current.price_per_share * quantity
                quantity = 0
            else:
                total_purchase_price += current.price_per_share * current.quantity_available
                quantity -= current.quantity_available
                current.quantity_available = 0
            current.save()
            index += 1

        profit = total_purchase_price - total_price
        wallet.sale_set.create(
            quantity_sold=number_of_shares,
            symbol=symbol,
            price_per_share=price,
            total_price= total_price,
            profit=profit,
        )

        wallet.share_set.filter(id__in=ids_to_delete).delete()
        wallet.save()
        update_wallet_value(wallet)
        
        return Response({'wallet': WalletSerializer(wallet).data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_shares(request, wallet_name):
    username = request.user
    user = User.objects.get(username=username)
    wallet = user.wallet_set.get(name=wallet_name)
    shares = wallet.share_set.all()
    shares_list = []
    values_list = wallet.walletvalue_set.values("date","value")
    for share in shares:
        shares_list.append(ShareSerializer(share).data)
    return Response({
        "wallet" : WalletSerializer(wallet).data,
        'shares' : shares_list,
        'wallet_values_overtime' : values_list
    }, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def update_or_make_selected_wallet(request, wallet_name):
    username = request.user
    user = User.objects.get(username=username)
    wallet = user.wallet_set.get(name=wallet_name)

    try:
        profile = Profile.objects.get(user=user)
        profile.selected_wallet = wallet
        profile.save()
        return Response({'wallet_id': wallet.id}, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        Profile.objects.create(user=user, selected_wallet=wallet)
        return Response({'wallet_id': wallet.id}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_selected_wallet(request):
    username = request.user
    user = User.objects.get(username=username)
    wallet = Profile.objects.get(user=user).selected_wallet

    return Response({"selected_wallet_name" : wallet.name}, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_transaction_history(request, wallet_name):
    username = request.user
    user = User.objects.get(username=username)
    wallet = user.wallet_set.get(name=wallet_name)
    purchase_list = wallet.purchase_set.values("symbol","quantity_purchased","price_per_share","total_price","date")
    sale_list = wallet.sale_set.values("symbol","quantity_sold","price_per_share","total_price","profit","date")

    purchases = list()
    for purchase in purchase_list:
        purchases.append(PurchaseSerializer(purchase).data)
    sales = list()
    for sale in sale_list:
        sales.append(SaleSerializer(sale).data)

    return Response({"purchases" : purchases, "sales" : sales}, status=status.HTTP_200_OK)


def update_wallet_value(wallet):
    symbols = list(wallet.share_set.values_list('symbol', flat=True).distinct())
    quotes = fmpsdk.quote(apikey=apikey,symbol=symbols)
    balance = 0
    for quote in quotes:
        quantity = wallet.share_set.filter(symbol=quote['symbol']).count()
        balance += quantity * quote['price']
    wallet.walletvalue_set.create(value=balance)

