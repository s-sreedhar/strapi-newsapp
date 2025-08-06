FROM node:20-alpine  # Explicitly use Node 20

WORKDIR /app

# Install exact npm version first
RUN npm install -g npm@9.8.1

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]