FROM node:17 AS build
ENV JQ_VERSION=1.6
ENV NODE_OPTIONS="--openssl-legacy-provider"

WORKDIR /home/node/app/

COPY ./app/package*.json /home/node/app/
RUN npm install

COPY ./app/ /home/node/app/

RUN npm run build

FROM nginx AS publish
LABEL maintainer="ACE digital solutions ag <solutions@ace.ch>"

COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template

ENV JSFOLDER=/usr/share/nginx/html/backend/static/js/*.js
COPY ./nginx/21-inject-react-env.sh /docker-entrypoint.d/99-inject-react-env.sh

COPY --from=build /home/node/app/build/ /usr/share/nginx/html/backend
