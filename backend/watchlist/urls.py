from django.urls import path
from . import views

urlpatterns = [
    # List all watchlists of the authenticated user
    path('', views.get_watchlists, name='list_watchlists'),
    path('create/', views.create_watchlist, name='create_watchlist'),
    path('<int:watchlist_id>/add-stock/', views.add_stock_to_watchlist, name='add_stock_to_watchlist'),
    path('<int:watchlist_id>/remove-stock/<str:symbol>/', views.remove_stock_from_watchlist, name='remove_stock_from_watchlist'),
    path('<int:watchlist_id>/stocks/', views.view_watchlist_stocks, name='view_watchlist_stocks')

    
]
