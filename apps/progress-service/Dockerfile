# Step 1: Use Node.js base image and configure non root user
FROM node:23-alpine

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot

# Step 2: Install pnpm globally
RUN npm install -g pnpm --ignore-scripts

# Step 3: Set the root working directory for the workspace
WORKDIR /app

# Step 4: Copy over shared package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Step 5: Copy over pnpm workspace config
COPY pnpm-workspace.yaml ./

# Step 6: Install dependencies with pnpm in offline mode, optimizing layer reuse
RUN pnpm install --frozen-lockfile --ignore-scripts

# Step 7: Copy only the specific microservice's code
COPY apps/progress-service ./apps/progress-service

# Important: Also copy the shared tsconfig.json if it's in the root (if applicable)
COPY tsconfig.json .

# Step 8: Move to the microservice directory and add the specific microservice's tsconfig.json
WORKDIR /app/apps/progress-service
COPY apps/progress-service/tsconfig.app.json .

# Step 9: Build the NestJS application for the specific microservice
RUN pnpm build:progress

# Step 10: Expose the appropriate port (adjust based on service)
EXPOSE 3002

# Step 11: Start the microservice
CMD ["pnpm", "start:progress"]