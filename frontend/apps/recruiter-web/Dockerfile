# Stage 1: Install all workspace dependencies
FROM oven/bun:latest AS deps

WORKDIR /app

# Copy workspace root metadata
COPY package.json bun.lock ./

# Copy all workspace package.json files for proper resolution
COPY packages/ui-components/package.json ./packages/ui-components/
COPY apps/candidate-web/package.json ./apps/candidate-web/
COPY apps/recruiter-web/package.json ./apps/recruiter-web/

# Install all workspace dependencies
RUN bun install --frozen-lockfile

# Stage 2: Build the app
FROM oven/bun:latest AS builder

WORKDIR /app

# First, copy all installed dependencies from deps stage
COPY --from=deps /app .

# Then copy source code (will overwrite package.json but not node_modules)
COPY . .

# Reinstall to ensure all dependencies are present (will use cached node_modules)
RUN bun install --frozen-lockfile

# Set working directory to app
WORKDIR /app/apps/recruiter-web

# Build the app (tsc -b && vite build)
RUN bun run build

# Stage 3: Production runtime
FROM nginx:alpine

# Copy nginx config from build context
COPY apps/recruiter-web/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built static files
COPY --from=builder /app/apps/recruiter-web/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
