FROM node:lts-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn global add nodemon && \
    yarn install

EXPOSE 4000

COPY . .

CMD [ "nodemon", "app.js" ]