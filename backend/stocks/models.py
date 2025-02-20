from django.db import models

# Create your models here.

# Stock(symbol, name, description)
class Stock(models.Model):
    symbol_id = models.CharField(max_length=10, unique=True, primary_key=True)
    name = models.CharField(max_length=100)

