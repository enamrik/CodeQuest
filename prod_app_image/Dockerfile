FROM enamrik/codequest_base:1

COPY . /src

RUN cd /src; npm install

EXPOSE 80

ENTRYPOINT sh /src/container_entrypoint.sh
