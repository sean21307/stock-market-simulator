# Generated by Django 5.1.6 on 2025-02-26 03:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wallets', '0002_alter_wallet_unique_together'),
    ]

    operations = [
        migrations.CreateModel(
            name='WalletValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.DecimalField(decimal_places=2, max_digits=15)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('wallet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wallets.wallet')),
            ],
        ),
    ]
