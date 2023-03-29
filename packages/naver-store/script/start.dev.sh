#!/bin/bash
export HOME="/root"

echo $HOME

LOG_POINT="/root/log/naver-store/deploy.log"

echo $LOG_POINT

echo ">[$(date) START DEPLOY BY USER : $(whoami)]" >>  $LOG_POINT

eval `ssh-agent -s`;
ssh-add /root/.ssh/vircle_deploy_key;

cd /root/vircle/packages/naver-store

echo ">[$(date) DELETE BUILD]" >> $LOG_POINT

rimraf dist

echo ">[$(date) PULL LATEST SOURCE FROM GITHUB]" >> $LOG_POINT

git pull >>  $LOG_POINT

yarn
echo $? >> $LOG_POINT


echo ">[$(date) BUILD START]: GET ENV File from S3" >> /root/deploy.log

#aws s3 cp s3://mass-adoption.app.env/vircle/naver-store/env/development.yaml ./env/development.yaml

echo ">[$(date) BUILD START]" >> $LOG_POINT

yarn -v >> $LOG_POINT
echo $? >> $LOG_POINT
if [ $? != "0" ]; then
  sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  source ~/.bashrc
  source ~/.profile
  nvm install 19
  nvm use 19
  npm install -g yarn
  npm install -g pm2
  npm install -g rimraf
fi

yarn build >> $LOG_POINT 2>&1

echo ">[$(date)] Kill All pm2 process]" >> $LOG_POINT

yarn pm2 kill

echo ">[$(date)] Application Run by pm2]" >> $LOG_POINT

NODE_ENV=development yarn pm2 start --name NAVER-STORE dist/src/main.js >> $LOG_POINT

echo ">[$(date)] Update Postman]" >> $LOG_POINT

sleep 20
node ./update-postman.js

echo "[$(date)] DONE DEPLOY]" >> $LOG_POINT