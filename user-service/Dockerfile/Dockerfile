# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies (including dev for build tools if needed)
RUN npm ci

# Production stage
FROM node:20-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy built modules and package files from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./

# Copy source code
COPY --chown=nodejs:nodejs . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose service port
EXPOSE 5000

# Use non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=15s --timeout=5s --retries=3 --start-period=10s \
  CMD node -e "require('http').get('http://localhost:5000/api/auth/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start service with graceful shutdown handling
CMD ["node", "index.js"]
