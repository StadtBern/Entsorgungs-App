FROM mysql:8.0.26
LABEL maintainer="ACE digital solutions ag <solutions@ace.ch>"
COPY ./authentication.cnf etc/mysql/conf.d/authentication.cnf
COPY ./erb-app-mysql.sql /docker-entrypoint-initdb.d/erb-app-mysql.sql