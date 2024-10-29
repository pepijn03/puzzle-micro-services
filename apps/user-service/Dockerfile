# Step 1: Use Node.js base image
FROM node:22-slim

# Step 2: Install pnpm globally
RUN npm install -g pnpm

# Step 3: Set the root working directory for the workspace
WORKDIR /app

# Step 4: Copy over shared package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Step 5: Copy over pnpm workspace config
COPY pnpm-workspace.yaml ./

# Step 6: Install dependencies with pnpm in offline mode, optimizing layer reuse
RUN pnpm install --frozen-lockfile

# Step 7: Copy only the specific microservice's code
COPY apps/user-service ./apps/user-service

# Step 8: Build the NestJS application for the specific microservice
WORKDIR /app/apps/user-service
RUN pnpm build:user

# Step 9: Expose the appropriate port (adjust based on service)
EXPOSE 3001

# Step 10: Start the microservice
CMD ["pnpm", "prod:user"]