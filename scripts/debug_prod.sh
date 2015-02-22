#!/bin/bash

$(boot2docker shellinit)
docker exec -it codequest_prod_debug node --debug-brk /src/app/app.js

