FROM node:8-alpine

WORKDIR /app
COPY . /app

RUN apk add --no-cache --virtual build-dependencies python make git g++ && \
    npm install && \
    chown -R node:node . && \
    npm cache clean --force && \
    apk del build-dependencies

USER node

CMD ["npm","start"]
