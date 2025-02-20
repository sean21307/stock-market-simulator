from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Watchlist

@receiver(post_save, sender=User)
def create_user_watchlist(sender, instance, created, **kwargs):
    if created:
        Watchlist.objects.create(user=instance)
