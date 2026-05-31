file="./schema.cql"
docker compose cp ${file} cassandra:/tmp/${file}
docker compose exec cassandra cqlsh -f /tmp/${file}
