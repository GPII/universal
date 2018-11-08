FROM node:8-alpine

WORKDIR /app
COPY . /app

RUN apk add --no-cache --virtual build-dependencies python make git g++ && \
    apk add --no-cache curl jq && \
    chown -R node:node . && \
    su node -c 'npm install' && \
    npm cache clean --force && \
    apk del build-dependencies

USER node

CMD ["npm","start"]
