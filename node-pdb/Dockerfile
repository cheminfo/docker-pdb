FROM node:10

RUN apt-get update && apt-get install -y git 

EXPOSE 80

WORKDIR /git

COPY src /git/node-pdb
COPY config.json /git/node-pdb

WORKDIR /git/node-pdb
RUN npm i --production && rm -rf /root/.npm /usr/local/share/.cache /root/.cache

CMD npm run server

