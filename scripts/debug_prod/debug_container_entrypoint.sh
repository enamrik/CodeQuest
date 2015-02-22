#!/bin/sh

mongod --dbpath /mongo/data --logpath /mongo/log/data.log --fork

node-inspector --no-preload --web-port 8090


