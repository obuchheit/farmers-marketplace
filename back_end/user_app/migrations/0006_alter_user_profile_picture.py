# Generated by Django 5.1.3 on 2024-12-19 03:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0005_alter_user_address_alter_user_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_picture',
            field=models.ImageField(blank=True, default='../media/default_images/default_post_image.jpg', null=True, upload_to='profile_pictures/', verbose_name='Profile Picture'),
        ),
    ]
