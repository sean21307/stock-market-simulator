from django.http import JsonResponse
from django.db.models import Max
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

    latest_dates = (
        EndOfDay.objects
        .values("symbol")
        .annotate(latest_date=Max("date"))
    )

    stock_data = []
    for entry in latest_dates:
        symbol = entry["symbol"]
        current_date = entry["latest_date"]

        current_price = (
            EndOfDay.objects
            .filter(symbol=symbol, date=current_date)
            .values_list("closing_price", flat=True)
            .first()
        )

        previous_price = (
            EndOfDay.objects
            .filter(symbol=symbol, date__lt=current_date)
            .order_by("-date")
            .values_list("closing_price", flat=True)
            .first()
        )

        if current_price is not None and previous_price is not None:
            change = (current_price / previous_price) - 1
        else:
            change = None

        stock_data.append({
            "symbol": symbol,
            "current_price": current_price,
            "change": change
        })

    return JsonResponse(stock_data, safe=False)