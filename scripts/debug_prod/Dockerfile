FROM enamrik/codequest

RUN npm install node-inspector -g

EXPOSE 8090

COPY . /debug

ENTRYPOINT sh /debug/debug_container_entrypoint.sh
