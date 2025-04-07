import decimal
import json
from decimal import Decimal

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from unicodedata import digit

from accounts.models import Profile
from wallets.models import Wallet, WalletValue, Order

import os
from dotenv import load_dotenv
import fmpsdk

from wallets.serializers import WalletSerializer, ShareSerializer, PurchaseSerializer, SaleSerializer, OrderSerializer

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
        quantity = Decimal(request.data.get('quantity'))

        price = Decimal(fmpsdk.quote_short(apikey=apikey,symbol=symbol)[0]['price'])
        print(type(price), " ",type(quantity))
        total_price = price * quantity
        wallet_owner_username = request.user

        user = User.objects.get(username=wallet_owner_username)
        wallet = user.wallet_set.get(name=wallet_name)
        wallet.balance = wallet.balance - total_price
        if wallet.balance < 0:
            return Response({'error': 'Transaction would make wallet Balance negative'}, status=status.HTTP_400_BAD_REQUEST)
        wallet.save()

        share = wallet.share_set.get_or_create(symbol=symbol)[0]
        share.quantity = share.quantity + quantity
        share.save()

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
        quantity = Decimal(request.data.get('quantity'))
        price = Decimal(fmpsdk.quote_short(apikey=apikey,symbol=symbol)[0]['price'])
        total_price = decimal.Decimal(price * quantity)
        wallet_owner_username = request.user
        user = User.objects.get(username=wallet_owner_username)
        wallet = user.wallet_set.get(name=wallet_name)
        wallet.balance += total_price

        share = wallet.share_set.get(symbol=symbol)
        share.quantity = share.quantity - quantity
        if share.quantity < 0.01:
            share.delete()
        else:
            share.save()

        wallet_purchases = list(wallet.purchase_set.filter(symbol=symbol, quantity_available__gt=0).order_by('date'))
        index = 0
        total_purchase_price = 0
        number_of_shares = quantity
        while quantity > 0.001:
            current = wallet_purchases[index]
            if current.quantity_available >= quantity:
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

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_orders(request, wallet_name):
    username = request.user
    user = User.objects.get(username=username)
    wallet = user.wallet_set.get(name=wallet_name)
    orders = wallet.order_set.all()
    orders_list = []
    for order in orders:
        orders_list.append(OrderSerializer(order).data)
    return Response(orders_list, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_order(request, wallet_name):
    username = request.user
    user = User.objects.get(username=username)
    wallet = user.wallet_set.get(name=wallet_name)
    type = request.data['type']
    symbol = request.data.get('symbol')
    quantity = request.data.get('quantity')
    target_price = request.data.get('target_price')

    order = wallet.order_set.create(
        type=type,
        symbol=symbol,
        quantity=quantity,
        target_price=target_price,
    )

    return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_order(request, order_id):
    Order.objects.get(id=order_id).delete()
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def complete_buy_order(request, wallet_id, order_id):
    stock_price = Decimal(request.data.get('stock_price'))
    wallet = Wallet.objects.get(id=wallet_id)
    order = Order.objects.get(id=order_id)
    try:
        share = wallet.share_set.get(symbol=order.symbol)
        share.quantity += order.quantity
    except ObjectDoesNotExist:
        share = wallet.share_set.create(symbol=order.symbol, quantity=order.quantity)
    share.save()
    wallet.balance -= stock_price * order.quantity
    wallet.save()
    wallet.purchase_set.create(
        symbol=order.symbol,
        quantity_purchased=order.quantity,
        quantity_available=order.quantity,
        price_per_share=stock_price,
        total_price=stock_price * order.quantity,
    )
    order.delete()
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def complete_sell_order(request, wallet_id, order_id):
    stock_price = Decimal(request.data['stock_price'])
    wallet = Wallet.objects.get(id=wallet_id)
    order = Order.objects.get(id=order_id)
    total_price = order.quantity * stock_price
    wallet.balance += total_price

    share = wallet.share_set.get(symbol=order.symbol)
    share.quantity = share.quantity - order.quantity
    if share.quantity < 0.01:
        share.delete()
    else:
        share.save()

    wallet_purchases = list(wallet.purchase_set.filter(symbol=order.symbol, quantity_available__gt=0).order_by('date'))
    index = 0
    total_purchase_price = 0
    number_of_shares = order.quantity
    while order.quantity > 0.001:
        current = wallet_purchases[index]
        if current.quantity_available >= order.quantity:
            current.quantity_available -= order.quantity
            total_purchase_price += current.price_per_share * order.quantity
            order.quantity = 0
        else:
            total_purchase_price += current.price_per_share * current.quantity_available
            order.quantity -= current.quantity_available
            current.quantity_available = 0
        current.save()
        index += 1

    profit = total_purchase_price - total_price
    wallet.sale_set.create(
        quantity_sold=number_of_shares,
        symbol=order.quantity,
        price_per_share=stock_price,
        total_price=total_price,
        profit=profit,
    )
    order.delete()
    wallet.save()

    return Response(status=status.HTTP_200_OK)


def update_wallet_value(wallet):
    symbols = list(wallet.share_set.values_list('symbol', flat=True).distinct())
    quotes = fmpsdk.quote(apikey=apikey,symbol=symbols)
    balance = 0
    for quote in quotes:
        num_of_shares = wallet.share_set.get(symbol=quote['symbol']).quantity
        balance += num_of_shares * Decimal(quote['price'])
    wallet.walletvalue_set.create(value=balance)

