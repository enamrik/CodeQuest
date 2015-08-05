#!/usr/bin/env bash

knife digital_ocean droplet create --server-name codequest-site \
                                      --image 12380137 \
                                      --location nyc3 \
                                      --size 512mb \
                                      --ssh-keys 195296 \
                                      --run-list "recipe[codequest::default]" \
                                      --zero
