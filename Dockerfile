FROM node:8

RUN npm install -g bower grunt-cli && \
    echo '{ "allow_root": true }' > /root/.bowerrc
