ARG BASE_URL="http://localhost:9999"
FROM node:22.9-alpine3.19 as build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN echo "export const BASE_URL = '${BASE_URL}';" > /app/src/configs/config.ts
RUN npm run build

FROM nginx
COPY --from=build /app/build/ /usr/share/nginx/html