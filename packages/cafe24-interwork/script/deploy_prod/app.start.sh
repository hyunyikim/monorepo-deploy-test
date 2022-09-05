#!/bin/bash
echo ">APP START[$(date)]: START" >> /root/deploy.log

pm2 list >> /root/deploy.log

pm2 kill >> /root/deploy.log

echo ">APP START[$(date)]: DONE" >> /root/deploy.log