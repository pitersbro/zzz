#!/bin/bash

URI="mongodb://admin:secret@localhost:27017?authSource=admin"

docker compose exec -T mongodb bash -c "sh /mongo/setup48.sh"

echo "Running Mongo 48..."
docker compose exec -T mongodb mongosh "$URI" /mongo/48.js
echo "Done!"
