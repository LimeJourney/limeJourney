FROM node:18-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN echo "Contents of /app after initial copy:"
RUN ls -la
RUN turbo prune core-backend --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy the base TypeScript config
COPY --from=builder /app/tsconfig.base.json .

# Echo contents after copying tsconfig.base.json
RUN echo "Contents of /app after copying tsconfig.base.json:"
RUN ls -la

# Copy the rest as before
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

# Echo contents after copying json files
RUN echo "Contents of /app after copying json files:"
RUN ls -la

RUN npm ci

# Copy full source
COPY --from=builder /app/out/full/ .

# Echo contents after copying full source
RUN echo "Contents of /app after copying full source:"
RUN ls -la

# Verify tsconfig.base.json exists
RUN if [ ! -f "tsconfig.base.json" ]; then echo "tsconfig.base.json is missing"; exit 1; fi

# Echo contents of the current directory before build
RUN echo "Contents of /app before running turbo build:"
RUN ls -la
RUN npx turbo run build --filter=core-backend...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeapp
USER nodeapp

COPY --from=installer /app/apps/core-backend/package.json .
COPY --from=installer /app/apps/core-backend/dist ./dist

# Copy the entrypoint script
COPY deploy/core-backend/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]