ARG BASE_URL="https://portal.wyrstream.nith-solutions.com"
FROM node:22.9-alpine3.19 as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN echo "export const BASE_URL = '${BASE_URL}';" > /app/src/configs/config.ts
RUN npm run build

FROM nginx
COPY --from=build /app/build/ /usr/share/nginx/html