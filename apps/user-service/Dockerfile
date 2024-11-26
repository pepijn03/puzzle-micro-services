# Use Node.js base image
FROM node:23-alpine

# First install pnpm globally as root and create non-root user and set ownership
RUN npm config set ignore-scripts true && \
    npm install -g pnpm && \
    pnpm config set ignore-scripts true \
    addgroup -S nonroot && \
    adduser -S nonroot -G nonroot && \
    mkdir -p /app && \
    chown -R nonroot:nonroot /app

# Switch to non-root user
USER nonroot

# Set the working directory
WORKDIR /app

# Copy over shared package.json and pnpm-lock.yaml files
COPY --chown=nonroot:nonroot package.json pnpm-lock.yaml ./

# Copy over pnpm workspace config
COPY --chown=nonroot:nonroot pnpm-workspace.yaml ./

# Install dependencies with pnpm in offline mode
RUN pnpm install --frozen-lockfile

# Copy only the specific microservice's code
COPY --chown=nonroot:nonroot apps/user-service ./apps/user-service

# Copy the shared tsconfig.json if it's in the root
COPY --chown=nonroot:nonroot tsconfig.json .

# Move to the microservice directory and add the specific microservice's tsconfig.json
WORKDIR /app/apps/user-service
COPY --chown=nonroot:nonroot apps/user-service/tsconfig.app.json .

# Build the NestJS application for the specific microservice
RUN pnpm build:user

# Expose the appropriate port
EXPOSE 3001

# Start the microservice
CMD ["pnpm", "start:user"]