FROM node:14-alpine AS build-client
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ 
WORKDIR /usr/app
COPY ./client/package.json ./client/package-lock.json ./
RUN npm ci
COPY ./client ./
RUN npm run build

FROM node:14-alpine
WORKDIR /usr/app
COPY ./server/package.json ./server/package-lock.json ./
RUN npm install --production
COPY ./server ./
COPY --from=build-client /usr/app/build ./public/
CMD NODE_PORT=$PORT npm run serve