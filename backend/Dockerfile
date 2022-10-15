FROM node:16.17.0

RUN mkdir -p /usr/src/api_app

WORKDIR /usr/src/api_app

# ./ => it means WORKDIR (the path we defined above)
COPY package.json ./
COPY package-lock.json ./

RUN npm install

# COPY from ./ (real current dir) to ./ (container's WORKDIR)
COPY ./ ./

CMD ["npm", "run", "watch"]