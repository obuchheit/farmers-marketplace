# Generated by Django 5.1.3 on 2024-12-28 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('group_app', '0004_notification'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='address',
            field=models.CharField(null=True),
        ),
        migrations.AlterField(
            model_name='group',
            name='group_image',
            field=models.ImageField(blank=True, default='group_images/group_default.png', null=True, upload_to='group_images/'),
        ),
    ]
