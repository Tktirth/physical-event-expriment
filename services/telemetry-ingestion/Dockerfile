# Use Node.js Alpine for smallest footprint and security
FROM node:20-alpine

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./
RUN npm install --production

# Copy source
COPY index.js ./

# Standard Cloud Run port
EXPOSE 8080

CMD ["node", "index.js"]
