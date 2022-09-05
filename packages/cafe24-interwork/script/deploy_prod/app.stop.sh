#!/bin/bash
echo ">APP STOP[$(date)]: START" >> /root/deploy.log

pm2 list >> /root/deploy.log

pm2 kill >> /root/deploy.log

echo ">APP STOP[$(date)]: DONE" >> /root/deploy.log