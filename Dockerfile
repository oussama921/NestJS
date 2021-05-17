FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV development
COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 3001

CMD [ "yarn", "start:dev" ]
