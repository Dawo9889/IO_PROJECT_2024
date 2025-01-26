FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

ARG DOCKER_ENV_FRONT_URL

RUN echo "VITE_API_URL=${DOCKER_ENV_FRONT_URL}" >> .env

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /usr/share/nginx/html/downloads

COPY cupid.apk /usr/share/nginx/html/downloads/cupid.apk

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
