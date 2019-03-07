FROM ubuntu:18.04

# Update apt-cache
RUN apt-get update
RUN apt-get -y install curl git gnupg

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get install -y nodejs
RUN node -v
RUN npm -v

# PREACR
RUN npm install -g preact-cli

# Install React project
ADD ./package.json /usr/local/preact_temp/
WORKDIR /usr/local/preact_temp/
RUN npm install

# Copy all the folder
WORKDIR /code/
ADD . /code/

# Link node_modules folders for Preact and build project
WORKDIR /code/
RUN ln -s /usr/local/preact_temp/node_modules node_modules
RUN npm run build


## NGINX
RUN add-apt-repository -y ppa:nginx/stable
RUN apt-get update
RUN apt-get install -y nginx

CMD ["ls"]
