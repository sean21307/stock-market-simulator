import json

from django.db.models import Max
from rest_framework import generics, mixins
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView


from .models import Stock, EndOfDay
from .serializers import StockSerializer, EndOfDaySerializer


# Create your views here.

class StockView(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.CreateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    lookup_field = 'symbol_id'

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)



@api_view(['GET'])
def getStockBySymbol(request,stock_symbol):
    data = dict()

    data['stockInfo'] = StockSerializer(Stock.objects.get(symbol_id=stock_symbol)).data
    data['prices'] = list(EndOfDay.objects.filter(symbol_id=stock_symbol).values('date','closing_price'))
    return Response(data)

@api_view(['GET'])
def getStockBySymbolAndRange(request,stock_symbol):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not start_date or not end_date:
        return Response({"error": "start_date and end_date are required."}, status=400)

    stock_prices = EndOfDay.objects.filter(
        symbol_id=stock_symbol,
        date__range=[start_date, end_date]
    ).values('date', 'closing_price')

    return Response(list(stock_prices), status=200)

@api_view(['GET'])
def getStocksAndPriceWithChange(request):

    latest_dates = (
        EndOfDay.objects
        .values("symbol_id")
        .annotate(latest_date=Max("date"))
    )

    stock_data = []
    for entry in latest_dates:
        symbol = entry["symbol_id"]
        current_date = entry["latest_date"]

        current_price = (
            EndOfDay.objects
            .filter(symbol_id=symbol, date=current_date)
            .values_list("closing_price", flat=True)
            .first()
        )

        previous_price = (
            EndOfDay.objects
            .filter(symbol_id=symbol, date__lt=current_date)
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

    return Response(stock_data)

class StockDetailsWithPrices(APIView):
    def get(self, request, symbol_id):
        stock = get_object_or_404(Stock, symbol_id=symbol_id)
        stock_data = StockSerializer(stock).data
        prices = EndOfDay.objects.filter(symbol_id=symbol_id).values('date', 'closing_price')

        return Response({
            "stockInfo": stock_data,
            "prices": list(prices)
        })

class EndOfDayList(ListAPIView):
    serializer_class = EndOfDaySerializer
    def get_queryset(self):
        symbol_id = self.kwargs['symbol_id']
        return EndOfDay.objects.filter(symbol_id=symbol_id)

class StockList(generics.ListAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
