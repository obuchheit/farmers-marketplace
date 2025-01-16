# Famers Marketplace

## Frameworks
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="django">
<g id="django_2">
<path id="Vector" d="M46.2064 0.000488281H62.5478V74.8984C54.1774 76.4817 48.0154 77.1047 41.3483 77.1047C21.3895 77.0838 11 68.1672 11 51.0422C11 34.5422 22.0204 23.8338 39.0979 23.8338C41.7479 23.8338 43.7668 24.0423 46.2064 24.6671V0.000488281ZM46.779 38.1646C44.8651 37.5395 43.288 37.3312 41.2688 37.3312C33.0037 37.3312 28.2296 42.3728 28.2296 51.2081C28.2296 59.8103 32.7936 64.5602 41.1639 64.5602C42.9724 64.5602 44.4446 64.4584 46.779 64.1458V38.1646Z" fill="#2BA977"/>
<path id="Vector_2" d="M89.2706 25.8446V63.345C89.2706 76.2594 88.3033 82.4698 85.464 87.8242C82.8139 92.9718 79.3228 96.2178 72.1091 99.8031L56.9456 92.6575C64.1593 89.305 67.6503 86.3427 69.8799 81.822C72.214 77.1991 72.9501 71.8447 72.9501 57.7615V25.8449H89.2706V25.8446ZM71.3034 0.000488281H87.6447V16.6047H71.3034V0.000488281Z" fill="#2BA977"/>
</g>
</g>
</svg>


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
