FROM codequest_base

RUN npm install node-inspector -g

RUN npm install forever -g

# Node server
EXPOSE 3000

# Node debug
EXPOSE 8080
EXPOSE 5858

ENTRYPOINT sh /src/container_entrypoint.sh
