# Generated by Django 5.1.6 on 2025-02-20 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("stocks", "0006_alter_stock_symbol_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="stock",
            name="name",
            field=models.CharField(max_length=500),
        ),
    ]
