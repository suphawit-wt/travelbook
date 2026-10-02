ARG NODE_VERSION=24-trixie

# ---------- Base ----------
FROM node:${NODE_VERSION} AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm && corepack prepare pnpm@11.23.0 --activate

# ---------- Dependencies ----------
FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

ENV HUSKY=0

# faster pnpm install with cache
RUN pnpm install --frozen-lockfile

# ---------- Builder ----------
FROM base AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
ARG NEXT_PUBLIC_FACEBOOK_OAUTH_APP_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
ENV NEXT_PUBLIC_FACEBOOK_OAUTH_APP_ID=$NEXT_PUBLIC_FACEBOOK_OAUTH_APP_ID
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

ENV HUSKY=0

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# ---------- Runner ----------
FROM gcr.io/distroless/nodejs24-debian13 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static
COPY --from=builder --chown=nonroot:nonroot /app/public ./public

USER nonroot:nonroot

EXPOSE 8080

CMD ["server.js"]