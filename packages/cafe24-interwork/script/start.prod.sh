#!/bin/bash
whoami

export HOME="/root"

cd ~/cafe24-interwork

export NODE_ENV=production

echo ">[$(date)] GET ENV File from S3" >> /root/deploy.log

aws s3 cp s3://mass-adoption.app.env/vircle/cafe24/.env .

echo ">[$(date)] Kill All pm2 process" >> /root/deploy.log

pm2 kill

echo ">[$(date)] Application Run by pm2" >> /root/deploy.log

pm2 start --name "CAFE24-INTERWORK" main.js

echo "[$(date)] server deploy" >> /root/deploy.log