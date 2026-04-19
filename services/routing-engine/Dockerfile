FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=8081
EXPOSE $PORT

CMD ["node", "index.js"]
