FROM codequest_base

COPY . /src

RUN cd /src; npm install

EXPOSE 80

ENTRYPOINT sh /src/container_entrypoint.sh
