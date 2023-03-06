FROM node:18.10.0-alpine3.15 as build-stage
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]