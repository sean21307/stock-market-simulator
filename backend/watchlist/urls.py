from django.urls import path
from .views import WatchlistViewSet

urlpatterns = [
    path('', WatchlistViewSet.as_view({'get': 'list'})),  # Get current user's watchlist
    path('<str:username>/', WatchlistViewSet.as_view({'get': 'get_by_username'})),  # Get a specific user's watchlist
    path('add/', WatchlistViewSet.as_view({'post': 'add_stock'})),  # Add stock
    path('remove/', WatchlistViewSet.as_view({'post': 'remove_stock'})),  # Remove stock
]
