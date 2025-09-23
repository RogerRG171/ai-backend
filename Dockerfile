FROM node:22-alpine AS builder

WORKDIR /app

COPY package.*json ./

RUN npm install

RUN npm prune --production

COPY . .

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app .

RUN npm install drizzle-kit

EXPOSE 3333

CMD ["npm", "start"]
