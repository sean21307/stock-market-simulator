from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

from .views import *

app_name = "stocks"
urlpatterns = [
    path("", views.getStocksAndPriceWithChange, name="stocks"),
    path("<str:symbol_id>/", StockDetailsWithPrices.as_view(), name="getStock"),
    path("single/<str:symbol_id>/", StockView.as_view(), name="stock"),
    path("<str:symbol_id>/range", views.getStockBySymbolAndRange, name="updateStock"),
    path("all", StockList.as_view(), name="test"),

]

urlpatterns = format_suffix_patterns(urlpatterns)