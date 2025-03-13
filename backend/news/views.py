import os
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dotenv import load_dotenv

load_dotenv()

apikey = os.getenv("API_KEY")
if not apikey:
    raise ValueError("API_KEY environment variable not set.")

GENERAL_NEWS_URL = "https://financialmodelingprep.com/api/v4/general_news?page=0"
STOCK_NEWS_URL = "https://financialmodelingprep.com/api/v3/stock_news"

@api_view(['GET'])
def get_general_news(request):
    params = {'page': 0, 'apikey': apikey}
    
    try:
        response = requests.get(GENERAL_NEWS_URL, params=params)
        return Response(response.json() if response.status_code == 200 else {"error": "Failed to retrieve news"}, status=response.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_stock_news(request, symbol):
    params = {
        'tickers': symbol,
        'from': request.GET.get('from', '2024-01-01'),
        'to': request.GET.get('to', '2024-03-01'),
        'page': request.GET.get('page', 0),
        'limit': request.GET.get('limit', 50),
        'apikey': apikey
    }

    try:
        response = requests.get(STOCK_NEWS_URL, params=params)
        return Response(response.json() if response.status_code == 200 else {"error": "Failed to retrieve stock news"}, status=response.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
