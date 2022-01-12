FROM node:12-alpine as builder

RUN npm install nodemon -g

RUN mkdir -p /teamcoo/v1

WORKDIR /teamcoo/v1

COPY . .

RUN npm install

RUN npm install pm2@3.5.0 -g

CMD pm2 start app.js -i 4 && tail -f /dev/null

EXPOSE 3000