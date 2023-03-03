#!/bin/bash
echo ">BEFORE INSTALL[$(date)]: START" >> /root/deploy.log

pm2 kill >> /root/deploy.log

rm -rf /root/naver-store >> /root/deploy.log

echo ">BEFORE INSTALL[$(date)]: DONE" >> /root/deploy.log