FROM node:22.9-alpine3.19 as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=build /app/build/ /usr/share/nginx/html