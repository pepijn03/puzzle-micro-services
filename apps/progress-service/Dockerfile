# Use Node.js base image and configure non root user
FROM node:23-alpine

# Set the nonroot user and group
RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot

# Set ignore-scripts for npm to true to prevent running scripts during install for security
RUN npm config set ignore-scripts true

# Install pnpm globally
RUN npm install -g pnpm

# Set ignore-scripts for pnpm to true to prevent running scripts during install for security
RUN pnpm config set ignore-scripts true+

# Set the root working directory for the workspace
WORKDIR /app

# Copy over shared package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Copy over pnpm workspace config
COPY pnpm-workspace.yaml ./

# Install dependencies with pnpm in offline mode, optimizing layer reuse
RUN pnpm install --frozen-lockfile

# Copy only the specific microservice's code
COPY apps/progress-service ./apps/progress-service

# Important: Also copy the shared tsconfig.json if it's in the root (if applicable)
COPY tsconfig.json .

# Move to the microservice directory and add the specific microservice's tsconfig.json
WORKDIR /app/apps/progress-service
COPY apps/progress-service/tsconfig.app.json .

# Build the NestJS application for the specific microservice
RUN pnpm build:progress

# Expose the appropriate port (adjust based on service)
EXPOSE 3002

# Start the microservice
CMD ["pnpm", "start:progress"]