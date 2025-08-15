FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY src ./src
COPY uploads ./uploads

ENV PORT=4000
EXPOSE 4000

CMD ["node", "src/server.js"]


