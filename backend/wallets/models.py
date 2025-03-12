from datetime import datetime

from django.contrib.auth.models import User
from django.db import models
from pytz import timezone


# ID, name, description, balance,  user_id
#   FK user_id -> user
class Wallet(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    balance = models.DecimalField(max_digits=12, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("name", "user")

class WalletValue(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

# ID, symbol, wallet_id, buying_price
#   FK wallet_id - > Wallet
class Share(models.Model):
    symbol = models.CharField(max_length=50)
    buying_price = models.DecimalField(max_digits=7, decimal_places=2)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)


class Purchase(models.Model):
    symbol = models.CharField(max_length=50)
    quantity_purchased = models.PositiveIntegerField()
    quantity_available = models.PositiveIntegerField()
    price_per_share = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField(auto_now=True)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)


class Sale(models.Model):
    symbol = models.CharField(max_length=50)
    quantity_sold = models.PositiveIntegerField()
    price_per_share = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField(auto_now=True)
    profit = models.DecimalField(max_digits=15, decimal_places=2)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)