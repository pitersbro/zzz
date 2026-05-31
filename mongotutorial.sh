#!/bin/bash

URI="mongodb://admin:secret@localhost:27017?authSource=admin"

echo "Running Mongo Tutorial..."
docker compose exec -T mongodb mongosh "$URI" /mongo/tutorial_0_16.js
echo "Done!"
