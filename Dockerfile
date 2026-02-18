# Stage 1: Build
FROM node:20-alpine AS builder

# Install minimal build dependencies for Linux
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy jsconfig.json for path aliases
COPY jsconfig.json ./

# Copy app source and public folder
COPY src ./src
COPY public ./public

# Clean previous build if exists
RUN rm -rf .next

# Build Next.js app (App Router uses src/app/layout.js automatically)
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy dependencies and build output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/jsconfig.json ./jsconfig.json

# Expose Next.js port
EXPOSE 3000

# Start Next.js production server
CMD ["npm", "run", "start"]
