# Use Node.js base image
FROM node:23-alpine

# First install pnpm globally as root
RUN npm config set ignore-scripts true && \
    npm install -g pnpm && \
    pnpm config set ignore-scripts true

# Create non-root user and set specific directories with minimal permissions
RUN addgroup -S nonroot && \
    adduser -S nonroot -G nonroot && \
    mkdir -p /app/node_modules && \
    mkdir -p /app/dist && \
    mkdir -p /app/.pnpm-store && \
    chown -R nonroot:nonroot /app/node_modules && \
    chown -R nonroot:nonroot /app/dist && \
    chown -R nonroot:nonroot /app/.pnpm-store

# Switch to non-root user
USER nonroot

# Set the working directory
WORKDIR /app

# Copy over shared package.json and pnpm-lock.yaml files with read-only permissions
COPY --chown=nonroot:nonroot --chmod=444 package.json pnpm-lock.yaml ./

# Copy over pnpm workspace config with read-only permissions
COPY --chown=nonroot:nonroot --chmod=444 pnpm-workspace.yaml ./

# Install dependencies with pnpm in offline mode
RUN pnpm install --frozen-lockfile

# Copy source code with read-only permissions
COPY --chown=nonroot:nonroot --chmod=444 apps/progress-service ./apps/progress-service
COPY --chown=nonroot:nonroot --chmod=444 tsconfig.json .
COPY --chown=nonroot:nonroot --chmod=444 apps/progress-service/tsconfig.app.json .

# Build the NestJS application
RUN pnpm build:progress

# Expose the appropriate port
EXPOSE 3002

# Start the microservice
CMD ["pnpm", "start:progress"]