# Install dependencies only when needed
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Cache buster - change this value to force rebuild
ARG CACHEBUST=4
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Accept build-time environment variables from Coolify (Only NEXT_PUBLIC_ are needed for build)
ARG NEXT_PUBLIC_STORAGE_STRATEGY=local
ARG NEXT_PUBLIC_FIREBASE_API_KEY=placeholder
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=placeholder
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID=placeholder
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=placeholder
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=placeholder
ARG NEXT_PUBLIC_FIREBASE_APP_ID=placeholder
ARG NEXT_PUBLIC_API_BASE_URL=https://logatech.net
ARG NEXT_PUBLIC_APP_URL=https://logatech.net

# Set them as ENV so the build process can access them
ENV NEXT_PUBLIC_STORAGE_STRATEGY=$NEXT_PUBLIC_STORAGE_STRATEGY
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Ensure storage directory exists and has correct permissions
RUN mkdir -p public/assets/storage/blog \
    public/assets/storage/users/avatars \
    public/assets/storage/payments/receipts \
    public/assets/storage/documents
RUN chown -R nextjs:nodejs public/assets/storage

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy scripts and package.json for admin seeding
COPY --from=builder /app/src/scripts ./src/scripts
COPY --from=builder /app/src/models ./src/models
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts/entrypoint.sh ./scripts/entrypoint.sh

# standalone contains its own node_modules, but for scripts we might need the main one
# or we can just point node to the standalone one. 
# For simplicity, since the image is already small, let's just make seeds work.

# Set entrypoint to fix permissions
USER root
RUN chmod +x ./scripts/entrypoint.sh
ENTRYPOINT ["./scripts/entrypoint.sh"]

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
