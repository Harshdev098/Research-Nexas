FROM node

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . ./

WORKDIR /app/login-system/

EXPOSE 3000

CMD [ "node", "dbServer.js" ]