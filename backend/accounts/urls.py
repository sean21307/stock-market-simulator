from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views
from .views import register_user
from .views import get_all_users
from .views import get_user_profile
from .views import put_user_profile


urlpatterns = [
    path('register/', register_user, name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/', get_all_users, name='get_all_users'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('test/', views.test_auth_token, name='test_auth_token'),
    path('logout/', views.logout_user, name='logout'),
    path('profile/', get_user_profile, name='get_user_profile'),
    path('profile/update', put_user_profile, name='put_user_profile'),
    path('leaderboard/', views.get_leaderboard, name='get_leaderboard'),
]
