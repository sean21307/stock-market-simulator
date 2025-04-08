# prediction/urls.py
from django.urls import path
from .views import stock_prediction

urlpatterns = [
path('<str:symbol>/', stock_prediction, name='stock-prediction'),
]
