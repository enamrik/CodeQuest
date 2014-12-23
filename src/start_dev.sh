#!/bin/sh

# ===============================
# Setup Virtual Box Port Forwarding
# ===============================
ports_needed=(3000 8080 5858)
declare -a ports_to_expose

for port in "${ports_needed[@]}"
do
    if ! VBoxManage showvminfo "boot2docker-vm" | grep -q -i "tcp-port$port"; then
        ports_to_expose=("${ports_to_expose[@]}" $port)
        echo "Missing port forward entry for $port. Will add..."
    fi
done

if [[ ${#ports_to_expose[@]} -ne 0 ]]; then

    echo "Could not find port forward entries ${ports_to_expose[@]}. Preparing to add..."
    if  boot2docker status | grep -q -i running;  then
        echo "Shutting down VM..."
        $(boot2docker shellinit)
        boot2docker down || exit
    fi

    for port in "${ports_to_expose[@]}"
    do
        echo "Adding port forward entry $port..."
        VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port$port,tcp,,$port,,$port" || exit
    done
    echo "Entries added"
fi

# ===============================
# Setup boot2docker for shell
# ===============================
if ! boot2docker status | grep -q -i running; then
    echo "boot2docker VM not running. Booting VM..."
    boot2docker up || exit
fi

if ! env | grep -q -i DOCKER_HOST; then
    echo "Setting up boot2docker environment variables..."
    $(boot2docker shellinit) || exit
fi

# ===============================
# Setup base image
# ===============================
if ! docker images | grep -q -i codequest_base; then
    echo "codequest_base image hasn't been built yet. Building..."
    cd ./base_image/
    source ./build.sh || exit
    cd ../
fi

# ===============================
# Setup development app image
# ===============================
if ! docker images | grep -q -i codequest_dev; then
    echo "codequest_dev image hasn't been built yet. Building..."
    docker build -t codequest_dev . || exit
fi

# ===============================
# Run and block shell
# ===============================

if [[ $1 == '-i' ]] ; then
    if docker ps -a | grep -q -i codequest_dev; then
        echo "Removing codequest_dev container..."
        docker rm -f codequest_dev || exit
    fi

    echo "Dev environment ready! Starting tty container..."
    docker run --rm -ti -P -p 3000:3000 -p 8080:8080 -p 5858:5858 -v `pwd`:/src --name codequest_dev codequest_dev
    echo "Stoping tty container..."
    exit 0
fi

# ===============================
# Run as deamon
# ===============================

# Force stop of running container
if [[ $1 == '--restart' ]] ; then
    if docker ps | grep -q -i codequest_dev; then
        echo "Stoping codequest_dev container..."
        docker stop codequest_dev || exit
    fi
fi

if ! docker ps | grep -q -i codequest_dev; then

    if docker ps -a | grep -q -i codequest_dev; then
        echo "Starting container..."
        docker start codequest_dev || exit
    else
        echo "Creating and starting container..."
        docker run -d -P -p 3000:3000 -p 8080:8080 -p 5858:5858 -v `pwd`:/src --name codequest_dev codequest_dev || exit
    fi
else
    echo "Container already running..."
fi

echo "Dev environment ready! Start playing..."

