from django.urls import path
from .views import get_general_news, get_stock_news, get_stock_news_titles

urlpatterns = [
    path('', get_general_news, name='general-news'),
    path('<str:symbol>/', get_stock_news, name='stock-news'),
    path('<str:symbol>/title/', get_stock_news_titles, name='stock-news'),

    
    
]
