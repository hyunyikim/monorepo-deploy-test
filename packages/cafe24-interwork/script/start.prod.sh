#!/bin/bash

REPOSITORY=/ssm-user/cafe24-interwork
cd $REPOSITORY

APP_NAME=cafe24-interwork

export NODE_ENV=production

echo ">[$(date)] GET ENV File from S3" >> /ssm-user/cafe24-interwork/deploy.log

aws s3 cp s3://mass-adoption.app.env/vircle/cafe24/.env

echo ">[$(date)] Kill All pm2 process" >> /ssm-user/cafe24-interwork/deploy.log

pm2 kill

echo ">[$(date)] Application Run by pm2" >> /ssm-user/cafe24-interwork/deploy.log

pm2 start server.js

echo "[$(date)] server deploy" >> /ssm-user/cafe24-interwork/deploy.log