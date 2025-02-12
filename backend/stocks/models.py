from django.db import models

# Create your models here.

# Stock(symbol, name, description)
class Stock(models.Model):
    symbol_id = models.CharField(max_length=10, unique=True, primary_key=True)
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
    symbol_id = models.ForeignKey('Stock', on_delete=models.CASCADE)

    class Meta:
        indexes = [
            models.Index(fields=["symbol_id", "-date", "closing_price"], name="idx_symbol_date_price")
        ]
        unique_together = ("symbol_id", "date")
