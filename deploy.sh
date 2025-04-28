#!/bin/bash

if [ "$1" != "blue" ] && [ "$1" != "green" ]; then
  echo "Usage: ./deploy.sh [blue|green]"
  exit 1
fi

APP=$1

echo "Deploying $APP version..."

# Ganti nginx.conf berdasarkan target
cp nginx.conf.template nginx.conf
sed -i "s/{{FE_HOST}}/fe_$APP/g" nginx.conf
sed -i "s/{{BE_HOST}}/be_$APP/g" nginx.conf

# Jalankan docker-compose yang sesuai
docker-compose -f docker-compose.${APP}.yml up -d --build

# Reload nginx reverse proxy
docker exec nginx_proxy nginx -s reload

echo "Deployment to $APP completed!"
