from datetime import date, datetime, timedelta
from gc import get_objects

from django.http import HttpResponse, JsonResponse
from django.db.models import Max
from django.shortcuts import render, get_object_or_404
from . import CsvStockReader as csv


from .models import Stock, EndOfDay


# Create your views here.
def getStockBySymbol(request,stock_symbol):
    return JsonResponse(csv.getStockData(stock_symbol),safe=False)

def getStockDetails(request,stock_symbol):
    data = list(Stock.objects.filter(symbol=stock_symbol).values())
    return JsonResponse(data,safe=False)

def getNewStockBySymbol(request,stock_symbol):
    data = dict()
    data['stockInfo'] = dict(Stock.objects.filter(symbol=stock_symbol).values().first())
    data['prices'] = list(EndOfDay.objects.filter(symbol=stock_symbol).values('date','closing_price'))
    return JsonResponse(data,safe=False)

def getStockBySymbolAndRange(request,stock_symbol,start,end):
    data = list(EndOfDay.objects.filter(symbol_id=stock_symbol, date__range=[start, end]).values('date', 'closing_price'))
    return JsonResponse(data, safe=False)

def getStocksAndPriceWithChange(request):
    listOfData = list()
    stocks = [symbol['symbol'] for symbol in Stock.objects.all().values("symbol")]

    for symbol in stocks:
        data = dict()
        data['symbol'] = symbol

        current_date = EndOfDay.objects.filter(symbol=symbol).aggregate(Max('date'))['date__max']
        if current_date.weekday == 0:
            previous_date = current_date - timedelta(days=3)
        else:
            previous_date = current_date - timedelta(days=1)

        current_price = list(EndOfDay.objects.filter(symbol=symbol).filter(date=current_date).values('closing_price'))[0]['closing_price']
        previous_price = list(EndOfDay.objects.filter(symbol=symbol).filter(date=previous_date).values('closing_price'))[0]['closing_price']

        data['current_price'] = current_price
        data['change'] = (current_price / previous_price) - 1
        listOfData.append(data)
    return JsonResponse(listOfData, safe=False)