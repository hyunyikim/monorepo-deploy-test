#!/bin/bash

echo ">AFTER INSTALL[$(date)]: START" >> /root/deploy.log

export HOME="/root"

cd ~/payment

export NODE_ENV=production

echo ">AFTER INSTALL[$(date)]: GET ENV File from S3" >> /root/deploy.log

aws s3 cp s3://mass-adoption.app.env/vircle/payment/.env.stage .env

echo ">AFTER INSTALL[$(date)]: Application Run by pm2" >> /root/deploy.log

pm2 start --name "PAYMENT" main.js

echo "AFTER INSTALL[$(date)]: DONE" >> /root/deploy.log