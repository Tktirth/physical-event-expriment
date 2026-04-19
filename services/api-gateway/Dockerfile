FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=4000
EXPOSE $PORT

CMD ["node", "index.js"]
