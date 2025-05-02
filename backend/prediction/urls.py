# prediction/urls.py
from django.urls import path
from .views import stock_prediction, general_news_prediction

urlpatterns = [
path('<str:symbol>/', stock_prediction, name='stock-prediction'),
path('', general_news_prediction, name='general-news-prediction'),

]
