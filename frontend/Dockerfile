# Stage 1: Build the application
FROM node:20-alpine AS builder

# Install dependencies needed for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./

# Set npm config to avoid hanging and reduce verbosity
RUN npm config set fetch-retries 3 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm ci --prefer-offline --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
