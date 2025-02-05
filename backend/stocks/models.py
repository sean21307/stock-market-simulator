from django.db import models

# Create your models here.

# Stock(symbol, name, description)
class Stock(models.Model):
    symbol = models.CharField(max_length=10, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()

# EndOfDay(id, symbol, date, endOfDayPrice, minPrice, maxPrice, volume)
# 	FK symbol -> Stocks
class EndOfDay(models.Model):
    date = models.DateField()
    closing_price = models.FloatField()
    open_price = models.FloatField()
    min_price = models.FloatField()
    max_price = models.FloatField()
    volume = models.IntegerField()
    symbol = models.ForeignKey('Stock', on_delete=models.CASCADE)
