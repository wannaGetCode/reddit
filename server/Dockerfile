FROM node

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

RUN npm run build

USER node

CMD [ "node", "dist/index.js" ]