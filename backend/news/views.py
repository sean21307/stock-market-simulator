import os
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response
import fmpsdk

load_dotenv()

apikey = os.getenv("API_KEY")

@api_view(['GET'])
def get_general_news(request):
    try:
        news = fmpsdk.general_news(apikey=apikey, page=0)
        return Response(news)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_stock_news(request, symbol):
    try:
        stock_news = fmpsdk.stock_news(apikey=apikey, tickers=[symbol])
        return Response(stock_news)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_stock_news_titles(request, symbol):
    try:
        stock_news = fmpsdk.stock_news(apikey=apikey, tickers=[symbol])
        titles = [news_item['title'] for news_item in stock_news] 
        return Response(titles)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
