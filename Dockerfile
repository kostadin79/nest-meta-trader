FROM node:14.20.0-slim
WORKDIR /app
COPY ./package.json /app/
RUN npm install
COPY . /app/
RUN npm run build
EXPOSE 8888
CMD [ "npm", "run", "start:prod" ]