FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# устанавливаем зависимости
RUN npm ci

# копируем исходный код
COPY . .

# собираем проект
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# копируем зависимости
COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# запуск
CMD ["node", "dist/main"]