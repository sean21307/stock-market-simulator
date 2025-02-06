from django.urls import path

from . import views

app_name = "stocks"
urlpatterns = [
    path("", views.getStocksAndPriceWithChange, name="stocks"),
    path("<str:stock_symbol>/details", views.getStockDetails, name="vote"),
    path("<str:stock_symbol>/", views.getStockBySymbol, name="vote"),
    path("new/<str:stock_symbol>/", views.getNewStockBySymbol, name="getStock"),
]