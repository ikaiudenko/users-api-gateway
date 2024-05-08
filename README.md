# App Readme

## Technology Stack

NestJs, RabbitMQ, MongoDB, TypeScript

## Local Environment Setup

1. Clone the repository.
2. Run `npm i` root directory.
3. Install Dockerhub. Once the docker engine starts running, start your local docker stack.
4. Run this command from root directory `docker-compose -f ./docker-compose.yml up -d`
5. Run services: `gateway`, `user-service`, `notification-service` using `npm run start:dev` cmd in inner folders.
6. Use `http://localhost:3000/api` to access the swagger API together with `x-api-key` provided in `.env` file.
