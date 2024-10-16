#!/bin/bash

if [ "$1" = "prod" ]; then
  echo "Starting Medigram in production mode..."
  DOCKERFILE=Dockerfile.prod NODE_ENV=production VOLUMES= NODE_MODULES_VOLUME= COMMAND="node server.js" docker-compose up --build
else
  echo "Starting Medigram in development mode..."
  docker-compose up --build
fi