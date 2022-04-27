FROM node:16
WORKDIR /usr/workspace/tdd-node-api
COPY ./package.json .
RUN npm install --only=prod

