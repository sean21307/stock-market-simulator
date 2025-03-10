# Generated by Django 5.1.6 on 2025-02-12 02:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0002_alter_endofday_unique_together_and_more'),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name='endofday',
            name='idx_symbol_date_price',
        ),
        migrations.RenameField(
            model_name='endofday',
            old_name='symbol',
            new_name='symbol_id',
        ),
        migrations.AlterUniqueTogether(
            name='endofday',
            unique_together={('symbol_id', 'date')},
        ),
        migrations.AddIndex(
            model_name='endofday',
            index=models.Index(fields=['symbol_id', '-date', 'closing_price'], name='idx_symbol_date_price'),
        ),
    ]
