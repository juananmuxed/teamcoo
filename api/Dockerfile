FROM node:12-alpine as builder

RUN mkdir -p /teamcoo

WORKDIR /teamcoo

COPY . .

RUN npm install

RUN npm install pm2@3.5.0 -g

CMD pm2 start app.js -i 2

EXPOSE 3000