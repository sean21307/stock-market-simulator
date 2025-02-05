from gc import get_objects

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from . import CsvStockReader as csv


from .models import Stock, EndOfDay


# Create your views here.
def getStockBySymbol(request,stock_symbol):
    return JsonResponse(csv.getStockData(stock_symbol),safe=False)

def getNewStockBySymbol(request,stock_symbol):
    data = list(EndOfDay.objects.filter(symbol=stock_symbol).values('date','closing_price'))
    return JsonResponse(data,safe=False)

def getStockBySymbolAndRange(request,stock_symbol,start,end):
    data = list(EndOfDay.objects.filter(symbol_id=stock_symbol, date__range=[start, end]).values('date', 'closing_price'))
    return JsonResponse(data, safe=False)