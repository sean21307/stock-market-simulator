from django.urls import path

from . import views

app_name = "stocks"
urlpatterns = [
    path("<str:stock_symbol>/", views.getStockBySymbol, name="vote")
]