import json

import fmpsdk
from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from wallets.models import Wallet

import os
from dotenv import load_dotenv
import fmpsdk

load_dotenv()
apikey = os.environ.get("API_KEY")

@permission_classes([IsAuthenticated])
@api_view(["GET"])
def get_wallets(request):
    wallet_owner_username = request.user
    user = User.objects.get(username=wallet_owner_username)
    return Response({"wallets": user.wallet_set}, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_wallet(request):
    body = json.loads(request.body)
    wallet_owner_username = request.user
    user = User.objects.get(username=wallet_owner_username)
    try:
        wallet = user.wallet_set.create(name=body['name'], description=body['description'], balance = 100000.00)
        return Response(wallet, status=status.HTTP_201_CREATED)
    except:
        return Response({'error': 'Error Creating Wallet'}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['PUT'])
def update_wallet(request, wallet_name):
    try:
        body = json.loads(request.body)
        wallet_owner_username = request.user
        user = User.objects.get(username=wallet_owner_username)
        wallet = user.wallet_set.get(name=wallet_name)

        wallet.name = body['name']
        wallet.description = body['description']
        wallet.save()
        return Response({'wallet': wallet}, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Error Updating Wallet'}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_wallet(request, wallet_name):
    try:
        body = json.loads(request.body)
        wallet_owner_username = request.user
        user = User.objects.get(username=wallet_owner_username)
        wallet = user.wallet_set.get(name=wallet_name)
        wallet.delete()
        return Response( status=status.HTTP_200_OK)
    except:
        return Response( {'error': 'Error Deleting Wallet'}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def add_shares(request, wallet_name):
    try:
        body = json.loads(request.body)
        symbol = body['symbol']
        quantity = body['quantity']

        price = fmpsdk.quote_short(apikey=apikey,symbol=symbol)[0]['price']
        total_price = price * quantity
        wallet_owner_username = request.user
        user = User.objects.get(username=wallet_owner_username)
        wallet = user.wallet_set.get(name=wallet_name)
        wallet.balance -= total_price
        if(wallet.balance < 0):
            return Response({'error': 'Transaction would make wallet Balance negative'}, status=status.HTTP_400_BAD_REQUEST)
        wallet.save()

        while(quantity > 0):
            wallet.share_set.create(symbol=symbol, buying_price=price)
            quantity -= 1
        return Response({'wallet': wallet}, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Error Adding Shares'}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def sell_shares(request, wallet_name):
    try:
        body = json.loads(request.body)
        symbol = body['symbol']
        quantity = body['quantity']
        price = fmpsdk.quote_short(apikey=apikey,symbol=symbol)[0]['price']
        total_price = price * quantity
        wallet_owner_username = request.user
        user = User.objects.get(username=wallet_owner_username)
        wallet = user.wallet_set.get(name=wallet_name)
        wallet.balance += total_price
        while(quantity > 0):
            share = wallet.share_set.filter(symbol=symbol).first()
            share.delete()
            quantity -= 1
    except:
        return Response({'error': 'Error Selling Shares'}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['Get'])
def get_shares(request, wallet_name):
    username = request.user
    user = User.objects.get(username=username)
    wallet = user.wallet_set.get(name=wallet_name)
    return Response({'shares': wallet.share_set.all()}, status=status.HTTP_200_OK)

