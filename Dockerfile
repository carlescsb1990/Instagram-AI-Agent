# Riona AI Agent - Production Docker Image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    tini \
    && rm -rf /var/cache/apk/*

# Set Puppeteer configuration
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S riona -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=riona:nodejs /app/build ./build
COPY --from=builder --chown=riona:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=riona:nodejs /app/package*.json ./
COPY --from=builder --chown=riona:nodejs /app/public ./public

# Create logs directory
RUN mkdir -p logs && chown riona:nodejs logs

# Switch to non-root user
USER riona

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Expose port
EXPOSE 3001

# Use tini as entrypoint for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "build/index.js"]

# Labels
LABEL maintainer="Riona AI Team <team@riona.ai>"
LABEL version="1.0.0"
LABEL description="Riona AI Agent - Complete social media automation system with AI"
LABEL org.opencontainers.image.title="Riona AI Agent"
LABEL org.opencontainers.image.description="Advanced Instagram automation with Google Gemini AI integration"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.vendor="Riona AI"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/riona-ai/agent"
