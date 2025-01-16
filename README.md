# Famers Marketplace

## Frameworks
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![React Bootstrap](https://img.shields.io/badge/React%20Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![PostGIS](https://img.shields.io/badge/PostGIS-4183C4?style=for-the-badge&logo=postgis&logoColor=white)


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
