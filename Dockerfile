# -----------------------------
# 1. STAGE: BUILD
# -----------------------------
FROM node:18-bullseye-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build
RUN ls -R dist

# -----------------------------
# 2. STAGE: PRODUCTION
# -----------------------------
FROM node:18-bullseye-slim AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./

RUN npm ci --production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
