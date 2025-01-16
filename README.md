# Famers Marketplace
Farmers Marketplace is a solution for those that want buy, sell, or trade with local farmers, and gardeners alike. With a feature rich interface users can post listings of their own food products, create or join groups with trusted members, or just browse local listings for fresh produce or food that they know doesn't come from industrial farming. 

## Frameworks

### Front End
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![React Bootstrap](https://img.shields.io/badge/React%20Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)


### Back End
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![PostGIS](https://img.shields.io/badge/PostGIS-4183C4?style=for-the-badge&logo=postgis&logoColor=white)

## Dependancies
Redis server 7.4.1
PostgreSQL 17.2
POSTGIS 3.5.1

## Dependancy Installation Instructions.

### Linux
```bash
sudo apt update
sudo apt install -y build-essential tcl
wget http://download.redis.io/releases/redis-7.4.1.tar.gz
tar xzf redis-7.4.1.tar.gz
cd redis-7.4.1
make
sudo make install
redis-server --version  

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget -qO - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt install -y postgresql-17
psql --version

sudo apt install -y postgis postgresql-17-postgis-3
sudo -u postgres psql -c "CREATE EXTENSION postgis;"
sudo -u postgres psql -c "SELECT PostGIS_Full_Version();"
```

### MacOS
```
brew update
brew install redis@7.4
brew services start redis
redis-server --version

brew install postgresql@17
brew services start postgresql@17
psql --version

brew install postgis
brew services start postgresql@17
psql postgres
CREATE EXTENSION postgis;
SELECT PostGIS_Full_Version();
```

## Instructions for Auto Adding Users and UserPosts
```bash
dropdb farmers_marketplace_db
createdb farmers_marketplace_db
python manage.py makemigrations
python manage.py migrate
python manage.py generate
```
The directory path to the generate file is /back_end/user_app/management/commands/generate.py
All users have the default password of DjangoReact1!

## Future Endeavors 
The Farmers Marketplace team plans to dockerize and deploy Farmers Marketplace utilizing AWS. We also plan to The potential for additonal features in the app is endless! 
