from django.urls import path
from . import views

urlpatterns = [
    # List all watchlists of the authenticated user
    path('', views.get_watchlists, name='list_watchlists'),
    path('new/', views.create_watchlist, name='create_watchlist'),
    path('delete/', views.delete_watchlist, name='delete_watchlist'),
    path('<str:watchlist_name>/add-stock/<str:symbol>', views.add_stock_to_watchlist, name='add_stock_to_watchlist'),
    path('<str:watchlist_name>/remove-stock/<str:symbol>', views.remove_stock_from_watchlist, name='remove_stock_from_watchlist'),
    path('<str:watchlist_name>/stocks/', views.view_watchlist_stocks, name='view_watchlist_stocks')

    
]
