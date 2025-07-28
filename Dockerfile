FROM node:22.17.1-alpine

WORKDIR /url-shortnerr

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "npm run migration:run && npm run start:dev"]
