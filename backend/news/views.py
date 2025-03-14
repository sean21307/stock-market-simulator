import os
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dotenv import load_dotenv

load_dotenv()

apikey = os.getenv("API_KEY")

GENERAL_NEWS_URL = "https://financialmodelingprep.com/api/v4/general_news?page=0"
STOCK_NEWS_URL = "https://financialmodelingprep.com/api/v3/stock_news"

@api_view(['GET'])
def get_general_news(request):
    try:
        response = requests.get(GENERAL_NEWS_URL, params={'apikey': apikey})
        return Response(response.json() if response.status_code == 200 else {"error": "Failed to retrieve news"}, status=response.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_stock_news(request, symbol):
    try:
        response = requests.get(STOCK_NEWS_URL, params={'tickers': symbol, 'apikey': apikey})
        return Response(response.json() if response.status_code == 200 else {"error": "Failed to retrieve stock news"}, status=response.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
