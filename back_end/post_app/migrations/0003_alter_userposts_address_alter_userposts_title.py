# Generated by Django 5.1.3 on 2024-12-24 15:49

import post_app.validators
import user_app.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post_app', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userposts',
            name='address',
            field=models.CharField(null=True, validators=[user_app.validators.validate_city_state_format]),
        ),
        migrations.AlterField(
            model_name='userposts',
            name='title',
            field=models.CharField(null=True, validators=[post_app.validators.validate_title]),
        ),
    ]