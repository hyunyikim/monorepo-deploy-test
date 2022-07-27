#!/bin/bash

REPOSITORY=/root/server
cd $REPOSITORY

APP_NAME=cafe24-interwork

echo ">[$(date)] Kill All pm2 process" >> /root/server/deploy.log

pm2 kill

echo ">[$(date)] Application Run by pm2" >> /root/server/deploy.log

pm2 start server.js

echo "[$(date)] server deploy" >> /root/server/deploy.log