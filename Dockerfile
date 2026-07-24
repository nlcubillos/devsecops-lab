# ============================================
# ETAPA 1: Build y Test
# ============================================
FROM node:20.18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm test

# ============================================
# ETAPA 2: Producción
# ============================================
FROM node:20.18-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001

COPY --from=builder --chown=appuser:nodejs /app/src ./src
COPY --from=builder --chown=appuser:nodejs /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["node", "src/server.js"]