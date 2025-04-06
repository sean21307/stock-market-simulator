from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

from .views import *

app_name = "stocks"
urlpatterns = [
    path("quotes/", get_quotes_by_symbols, name="quotes"),
    path("congress/", get_congress_trades, name="congress"),
    path("search/<str:query>/", get_stock_from_search, name="search"),
    path("<str:symbol>/", get_stock_details_with_1y_EOD_data, name="getStock"),
    path("", views.get_all_supported_symbols, name="test"),
    path("<str:symbol>/range", get_EOD_prices_by_range, name="range"),

]

urlpatterns = format_suffix_patterns(urlpatterns)