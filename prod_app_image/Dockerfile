FROM codequest-base

COPY . /src

RUN cd /src; npm install

EXPOSE 80

ENTRYPOINT sh /src/prod_app_image/container_entrypoint.sh
