eval `ssh-agent -s`;
ssh-add ~/.ssh/vircle_deploy_key;

cd ~/vircle/packages/cafe24-interwork

echo ">[$(date) PULL LATEST SOURCE FROM GITHUB]" >> ~/log/cafe24-interwork/deploy.log

git pull >>  ~/log/cafe24-interwork/deploy.log

yarn
yarn build

echo ">[$(date)] Kill All pm2 process" >> ~/log/cafe24-interwork/deploy.log

yarn pm2 kill

echo ">[$(date)] Application Run by pm2" >> ~/log/cafe24-interwork/deploy.log

NODE_ENV=development yarn pm2 start --name CAFE24-INTERWORK dist/main.js

echo "[$(date)] start on dev mode" >> ~/log/cafe24-interwork/deploy.log