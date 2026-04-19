# Use Node.js Alpine
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy source
COPY index.js ./

# Standard Cloud Run port
EXPOSE 8081

CMD ["node", "index.js"]
