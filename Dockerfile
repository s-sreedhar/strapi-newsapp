FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-1337}/_health || exit 1

# Use PORT environment variable
ENV PORT 1337
EXPOSE ${PORT}

CMD ["npm", "run", "start"]