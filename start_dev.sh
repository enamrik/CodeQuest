#!/bin/sh

if ! env | grep -q -i DOCKER_HOST; then
    echo "Setting up boot2docker environment variables..."
    $(boot2docker shellinit)
fi

if VBoxManage showvminfo | grep -q -i tcp-port3000; then
    echo "Could not find port forward entry. Preparing to add..."
    if  boot2docker status | grep -q -i running;  then
        echo "Shutting down VM..."
        boot2docker down
    fi

    echo "Adding port forward entries..."
    VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port3000,tcp,,3000,,3000"
    echo "Entries added"
fi

if ! boot2docker status | grep -q -i running; then
    echo "Booting VM..."
    boot2docker up
fi

if ! docker images | grep -q -i codequest_base; then
    echo "codequest_base image hasn't been built yet. Building..."
    cd ./base_image/
    source ./build.sh
    cd ../
fi

if ! docker images | grep -q -i codequest_dev; then
    echo "codequest_dev image hasn't been built yet. Building..."
    docker build -t codequest_dev .
fi

if [ $1 == '--restart' ] ; then
    if docker ps | grep -q -i codequest_dev; then
        echo "Stoping codequest_dev container..."
        docker stop codequest_dev
    fi
fi

if ! docker ps | grep -q -i codequest_dev; then

    if docker ps -a | grep -q -i codequest_dev; then
        echo "Starting container..."
        docker start codequest_dev
    else
        echo "Creating and starting container..."
        docker run -d -P -p 3000:3000 -v `pwd`:/src --name codequest_dev codequest_dev
    fi
else
    echo "Container already running..."
fi

echo "Dev environment ready! Start playing..."

