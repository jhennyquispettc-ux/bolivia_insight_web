# Single stage on purpose.
#
# Prisma generates its client into node_modules/.prisma, not into dist/. A
# multi-stage build with `npm ci --omit=dev` in the runner would drop that
# generated client and fail at runtime unless node_modules/.prisma and
# node_modules/@prisma/client are hand-copied across stages. The image goes from
# roughly 250 MB to 600 MB, which Cloud Run does not care about, and the build
# stays something you can reason about at midnight.
FROM node:24-slim

# openssl is required by Prisma's query engine on slim images.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

# prisma/ must be present before `prisma generate` runs.
COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

ENV NODE_ENV=production

# Cloud Run injects PORT (8080 by default); src/main.ts already reads it.
EXPOSE 8080

CMD ["node", "dist/main"]
