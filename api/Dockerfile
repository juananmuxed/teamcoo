FROM node:12-alpine as builder

RUN mkdir -p /teamcoo/v1

WORKDIR /teamcoo/v1

COPY . .

RUN npm install

RUN npm install pm2 -g

CMD pm2 start app.js -i 0 && tail -f /root/.pm2/logs/app-out.log

EXPOSE 3000