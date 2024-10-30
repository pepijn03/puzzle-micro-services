# Step 1: Use Node.js base image
FROM node:23-alpine

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
COPY apps/puzzle-service ./apps/puzzle-service

# Important: Also copy the shared tsconfig.json if it's in the root (if applicable)
COPY tsconfig.json .

# Step 8: Move to the microservice directory and add the specific microservice's tsconfig.json
WORKDIR /app/apps/puzzle-service
COPY apps/puzzle-service/tsconfig.app.json .

# Step 9: Build the NestJS application for the specific microservice
RUN pnpm build:puzzle

# Step 10: Expose the appropriate port (adjust based on service)
EXPOSE 3003

# Step 11: Start the microservice
CMD ["pnpm", "start:puzzle"]