# Generated by Django 5.1.3 on 2024-12-11 05:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_post_app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userposts',
            name='seller_name',
        ),
    ]