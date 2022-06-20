FROM node
LABEL maintainer="ACE digital solutions ag <solutions@ace.ch>"

RUN apt-get update && apt-get install --no-install-recommends -y default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

COPY . /home/node/app

EXPOSE 80

WORKDIR /home/node/app/

ENTRYPOINT ["docker-entrypoint.sh", "./entrypoint.sh"]
RUN npm install
CMD npm start