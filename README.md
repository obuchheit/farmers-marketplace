# Famers Marketplace

## Frameworks

## Instructions for Auto Adding Users and UserPosts

```bash
dropdb farmers_marketplace_db
createdb farmers_marketplace_db
python manage.py makemigrations
python manage.py migrate
python manage.py generate
```

The directory path to see the users created is /back_end/user_app/management/commands/generate_users_and_posts.py
All users have the default password of DjangoReact1!

I couldn't get images to populate. Images are stored in the media directory in the back_end if you want to add pictures to the profiles and posts.
