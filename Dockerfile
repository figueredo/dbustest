FROM solita/ubuntu-systemd:latest

# configure apt for non standard packages
RUN apt-get update \
 && apt-get install -y \
      curl apt-transport-https

# add node 6.x repo
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -

# add yarn repo
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# install build tools and dependencies
RUN apt-get update \
 && apt-get install -y --allow-unauthenticated \
      build-essential pkgconf nodejs yarn dbus

RUN apt-get install -y libdbus-1-dev libglib2.0-dev

COPY br.org.cesar.KNoT.conf /etc/dbus-1/system.d/br.org.cesar.KNoT.conf

# install modules
WORKDIR /usr/local/bin/app
COPY package.json .
RUN npm_config_tmp=/tmp TMP=/tmp yarn

CMD ["/bin/bash", "-c", "exec  /sbin/init --log-target=journal 3>&1"]