#!/bin/bash
whoami

LOG_POINT=~/log/cafe24-interwork/deploy.log

echo LOG_POINT

echo ">[$(date) START DEPLOY BY USER : ${whoami}]" >>  LOG_POINT

eval `ssh-agent -s`;
ssh-add ~/.ssh/vircle_deploy_key;

cd ~/vircle/packages/cafe24-interwork

echo ">[$(date) PULL LATEST SOURCE FROM GITHUB]" >> LOG_POINT

git pull >>  LOG_POINT

yarn

echo ">[$(date) BUILD START]" >> LOG_POINT

yarn build

echo ">[$(date)] Kill All pm2 process]" >> LOG_POINT

pm2 kill

echo ">[$(date)] Application Run by pm2]" >>LOG_POINT

NODE_ENV=development pm2 start --name CAFE24-INTERWORK dist/main.js >> LOG_POINT

echo "[$(date)] DONE DEPLOY]" >> LOG_POINT