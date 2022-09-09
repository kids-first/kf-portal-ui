FROM node:18.8-alpine3.16 as build-stage
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install --ignore-scripts && npm rebuild sass
COPY ./ /app/
RUN npm run build

FROM nginx:1.20

COPY --from=build-stage /app/build/ /usr/share/nginx/html

COPY static.conf /etc/nginx/conf.d/default.conf