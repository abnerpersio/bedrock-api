FROM node:14 AS base

RUN npm config set cache /home/node/app/.npm-cache --global

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
ENV PATH /app/node_modules/.bin:$PATH

RUN npm install

COPY . .

ENV PORT 80
EXPOSE 80

CMD [ "npm", "run", "deploy" ]