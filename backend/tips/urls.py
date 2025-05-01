from django.urls import path
from .views import get_investing_tips

urlpatterns = [
    path("investing-tips/", get_investing_tips),
]
