# Generated by Django 5.1.3 on 2024-12-16 21:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0002_remove_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='address',
            field=models.CharField(max_length=100, null=True, verbose_name='Location Address'),
        ),
    ]
