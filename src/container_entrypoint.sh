#!/bin/sh

mongod --dbpath /mongo/data --logpath /mongo/log/data.log --fork

node /src/app/app.js --prod


