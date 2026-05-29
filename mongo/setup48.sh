#!/bin/bash

mongosh \
  "mongodb://admin:secret@localhost:27017/company?authSource=admin" \
  --eval "db.getSiblingDB('company').workers.drop()"

echo "Importing data from my_workers.csv"
mongoimport --uri "mongodb://admin:secret@localhost:27017/company?authSource=admin" \
  --db company \
  --collection workers \
  --file /mongo/my_workers.csv \
  --type csv --headerline


echo "MongoDb setup done"
