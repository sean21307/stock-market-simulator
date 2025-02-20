from django.db import models
from django.contrib.auth.models import User


class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.username}'s Watchlist"
