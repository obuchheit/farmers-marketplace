# Generated by Django 5.1.3 on 2025-01-02 15:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('group_app', '0005_alter_group_address_alter_group_group_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='invitation',
            old_name='staus',
            new_name='status',
        ),
    ]
