FROM node:16-slim

WORKDIR /usr/vircle

COPY ./ ./

WORKDIR /usr/vircle/packages/shipping-tracking

RUN yarn build

EXPOSE 5005/TCP

CMD ["yarn", "start:prod"]