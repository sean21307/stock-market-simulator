from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from . import CsvStockReader as csv
import json
# Create your views here.
def getStockBySymbol(request,stock_symbol):
    return JsonResponse(csv.getStockData(stock_symbol),safe=False)