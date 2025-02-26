from django.conf import settings
from django.db import models
from django.contrib.auth.models import User


class Watchlist(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('name', 'user')

    def __str__(self):
        return self.name

class WatchlistStock(models.Model):
    watchlist = models.ForeignKey(Watchlist, related_name='items', on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)

    class Meta:
        unique_together = ('watchlist', 'symbol')

    def __str__(self):
        return self.symbol
