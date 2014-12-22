#!/bin/sh

echo "Starting mongodb..."
mongod --dbpath /mongo/data --logpath /mongo/log/data.log --fork

echo "Starting express app..."
forever start -c "node --debug-brk" /src/app/app.js

echo "Starting node inspector..."
node-inspector --save-live-edit --no-preload



