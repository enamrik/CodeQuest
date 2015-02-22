FROM ubuntu:14.04

RUN apt-get update


# Install MongoDB
#==============================

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' \
  | tee /etc/apt/sources.list.d/10gen.list

RUN apt-get update && apt-get install -y mongodb-org

RUN mkdir -p /mongo/data

RUN mkdir -p /mongo/log


# Install NodeJS
#==============================

RUN apt-get install -y nodejs npm

# Symlink nodejs to node
RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10


# Install codequest
#==============================

COPY . /src

RUN cd /src; npm install

# Website
EXPOSE 3000
# Mongodb
EXPOSE 27017

ENTRYPOINT sh /src/container_entrypoint.sh
