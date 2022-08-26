# FROM node:12.16.3-alpine
FROM node:16.16.0-alpine3.15

ARG start_env
ENV START_ENV ${start_env}

RUN npm install -g cnpm --registry=https://registry.npmmirror.com
# RUN mkdir -p /home/Service
# WORKDIR /home/Service

# COPY ./serve/package.json /home/Service/package.json
# RUN npm cache clean --force
RUN cnpm i
# COPY ./serve /home/Service

# CMD npm run deploy
EXPOSE 7001
CMD npm run start:$START_ENV