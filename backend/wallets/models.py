from django.contrib.auth.models import User
from django.db import models


# ID, name, description, balance,  user_id
#   FK user_id -> user
class Wallet(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    balance = models.DecimalField(max_digits=12, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("name", "user")

# ID, symbol, wallet_id, buying_price
#   FK wallet_id - > Wallet
class Share(models.Model):
    symbol = models.CharField(max_length=50)
    buying_price = models.DecimalField(max_digits=7, decimal_places=2)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)