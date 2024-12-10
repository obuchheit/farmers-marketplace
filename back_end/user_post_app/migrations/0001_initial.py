# Generated by Django 5.1.3 on 2024-12-10 03:20

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPosts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='')),
                ('title', models.CharField(null=True)),
                ('seller_name', models.CharField()),
                ('description', models.TextField(null=True)),
                ('location', models.CharField(null=True)),
                ('time_posted', models.DateTimeField(auto_now_add=True)),
                ('is_available', models.BooleanField(default=True, null=True)),
                ('is_public', models.BooleanField(default=True, null=True)),
                ('user', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_posts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserSavedPosts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('saved_at', models.DateTimeField(auto_now_add=True)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_by_users', to='user_post_app.userposts')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_posts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'post')},
            },
        ),
    ]
