FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG DOCKER_ENV_FRONT_URL

RUN echo "VITE_API_URL=${DOCKER_ENV_FRONT_URL}" >> .env

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
