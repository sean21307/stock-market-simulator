from django.urls import path
from .views import get_general_news, get_stock_news

urlpatterns = [
    path('general/', get_general_news, name='general-news'),
    path('<str:symbol>/', get_stock_news, name='stock-news'),
]
