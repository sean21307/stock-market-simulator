from django.contrib.auth.models import User
from django.db import models

from wallets.models import Wallet


# Create your models here.

class Profile(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,)
    selected_wallet = models.ForeignKey(Wallet,on_delete=models.CASCADE,)

class LeaderBoardRanking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profit = models.FloatField(default=0)