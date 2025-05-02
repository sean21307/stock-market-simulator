from datetime import timedelta, date

import requests

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .constants import symbols_list

import os
from dotenv import load_dotenv
import fmpsdk

load_dotenv()
apikey = os.environ.get("API_KEY")

@api_view(['GET'])
def get_congress_trades(request):
    # fmpsdk doesn't have endpoints for house so just calling it normally
    senate_url = 'https://financialmodelingprep.com/stable/senate-latest'
    house_url = 'https://financialmodelingprep.com/stable/house-latest'

    try:
        senate_response = requests.get(senate_url, params={'apikey': apikey, 'limit': 20})
        house_response = requests.get(house_url, params={'apikey': apikey, 'limit': 20})
        senate_data = senate_response.json()
        house_data = house_response.json()

        for entry in senate_data:
            entry['chamber'] = 'Senate'
        for entry in house_data:
            entry['chamber'] = 'House'

        combined_data = senate_data + house_data
        combined_data.sort(key=lambda x: x.get('transactionDate', ''), reverse=True)

        return Response(combined_data)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def get_stock_from_search(request, query):
    return Response(fmpsdk.search_ticker(apikey=apikey, query=query, limit=5))

@api_view(['GET'])
def get_stock_details_with_1y_EOD_data(request, symbol):
    stock_data = fmpsdk.company_profile(apikey=apikey, symbol=symbol)[0]
    today = date.today()
    today_minus_year = today - timedelta(days=365)
    prices = fmpsdk.historical_price_full(apikey=apikey, symbol=symbol, from_date=str(today_minus_year),
                                          to_date=str(today))
    close_prices = list()
    for price in prices:
        close_prices.append({
            "date": price["date"],
            "closing_price": price["close"],
        })
    return Response({
        "stockInfo": stock_data,
        "prices": close_prices
    })

@api_view(['GET'])
def get_EOD_prices_by_range(request, symbol):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    if not start_date or not end_date:
        return Response({"error": "start_date and end_date are required."}, status=400)
    if not symbol:
        return Response({"error": "symbol is required."}, status=400)
    return Response(fmpsdk.historical_price_full(apikey=apikey, symbol=symbol, from_date=start_date, to_date=end_date))

@api_view(['GET'])
def get_all_supported_symbols(request):
    print(symbols_list)
    return Response(fmpsdk.quote(apikey=apikey, symbol=symbols_list))

@api_view(['POST'])
def get_quotes_by_symbols(request):
    list_of_symbols = request.data.get('symbols')
    stocks = fmpsdk.quote(apikey=apikey, symbol=list_of_symbols)

    stock_quotes = dict()
    for stock in stocks:
        name = stock.get("name")
        changesPercentage = stock.get("changesPercentage")
        price = stock.get("price")


        stock_quotes[stock.get("symbol")] = {
            "name": name,
            "changesPercentage": changesPercentage,
            "price": price,
        }

    return Response(stock_quotes)

@api_view(['GET'])
def get_stock_gainers(request):
    gainers = fmpsdk.gainers(apikey=apikey)

    return Response(gainers)

@api_view(['GET'])
def get_stock_losers(request):
    losers = fmpsdk.losers(apikey=apikey)
    return Response(losers)
