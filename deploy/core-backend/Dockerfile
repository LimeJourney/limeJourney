FROM node:18-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
COPY ../../packages ./packages
COPY ../../package.json ../../package-lock.json ../../turbo.json ../../tsconfig.base.json ./
RUN turbo prune --scope=core-backend --docker

FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/turbo.json /app/tsconfig.base.json ./
RUN npm run build -- --filter=core-backend...

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeapp
USER nodeapp
COPY --from=installer /app/package.json .
COPY --from=installer /app/dist ./dist
COPY --from=installer /app/packages ./packages

CMD ["node", "dist/index.js"]