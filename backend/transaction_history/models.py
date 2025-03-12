from django.db import models

from wallets.models import Wallet


class Purchase(models.Model):
    quantity_purchased = models.PositiveIntegerField()
    quantity_available = models.PositiveIntegerField()
    price_per_share = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField()
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
