FROM node:8-alpine

WORKDIR /app
COPY . /app

RUN apk add --no-cache --virtual build-dependencies python make git g++ && \
    apk add --no-cache curl jq && \
    chown -R node:node . && \
    su node -c 'npm install' && \
    npm cache clean --force && \
    apk del build-dependencies

# New Relic requires some config bootstrapping. The good stuff (like license
# key) will be provided by env vars.
RUN cp /app/node_modules/newrelic/newrelic.js /app/newrelic.js

USER node

CMD ["npm","start"]
