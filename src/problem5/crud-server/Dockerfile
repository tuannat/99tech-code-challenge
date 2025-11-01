# Stage 1: The "builder" stage
# This stage installs all dependencies, including devDependencies,
# to build the TypeScript code into JavaScript.
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and lock file
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies for building)
RUN npm install

# Copy the rest of the source code
COPY . .

# Run the build script (which runs 'tsc')
RUN npm run build

# ---

# Stage 2: The "production" stage
# This stage starts from a fresh, lightweight Node image
# and only copies the necessary production files.
FROM node:18-alpine

WORKDIR /app

# Copy the package.json and lock file again
COPY package.json package-lock.json* ./

# Install *only* production dependencies
RUN npm install --omit=dev

# Copy the compiled JavaScript code from the "builder" stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/database.sqlite ./database.sqlite

# Expose the port the app runs on (seen from src/index.ts)
EXPOSE 3000

# The command to run the application in production
CMD [ "npm", "run", "start" ]