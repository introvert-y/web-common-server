FROM node:12.16.3-alpine
# FROM node:16.16.0-alpine3.15

ARG start_env
ENV START_ENV ${start_env}

RUN mkdir -p /home/Service
WORKDIR /home/Service
RUN npm install -g cnpm --registry=https://registry.npmmirror.com
# RUN npm cache clean --force
RUN cnpm i

# CMD npm run deploy
EXPOSE 7001
CMD npm run start:$START_ENV