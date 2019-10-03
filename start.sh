#!/bin/bash

# gives the capacity to the local user to user `/usr/bin/node` without sudo
# if this does not work, check where your installation of node is: `which node`
sudo setcap cap_net_bind_service=ep /usr/bin/node
npm run start
