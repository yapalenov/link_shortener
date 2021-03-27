FROM node:14

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .

RUN npm install -g yarn

COPY . .

EXPOSE 3000

CMD yarn run build && yarn run typeorm:prod migration:run && yarn run start:prod