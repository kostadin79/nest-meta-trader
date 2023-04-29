FROM node:16.20.0-alpine3.17
RUN apk --no-cache add --virtual .builds-deps build-base python3
WORKDIR /app
COPY ./package.json /app/
RUN npm install
COPY . /app/
RUN npm run build
EXPOSE 8888
CMD [ "npm", "run", "start:prod" ]