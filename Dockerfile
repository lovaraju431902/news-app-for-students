# Multi-stage Dockerfile for Next.js stand-alone builds
# Using node:20-slim (Debian) for best Prisma engine binary compatibility

FROM node:20-slim AS base

# Install OpenSSL, CA certificates and curl for health check / database operations
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Copy package descriptors for clean npm installation
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client for linux-debian binary target
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/news_db?schema=public"
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate

# Build Next.js
RUN npx next build

# Stage 3: Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root system group and user with a home directory
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --create-home --home-dir /home/nextjs nextjs

# Copy essential files for runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copy full node_modules from builder to provide Prisma CLI and other local binaries at runtime
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Automatically leverage Next.js output file tracing to copy standalone node files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set permission for Next.js build-time prerender cache
RUN mkdir -p .next && chown -R nextjs:nodejs .next

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Server execution
CMD ["node", "server.js"]
