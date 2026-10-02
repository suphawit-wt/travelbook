FROM golang:1.27-trixie AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

COPY . .

WORKDIR /app/apps/auth-service

RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    CGO_ENABLED=1 GOOS=linux go build \
    -trimpath \ 
    -ldflags="-s -w" \
    -o tb-auth-service ./cmd/http

FROM gcr.io/distroless/cc-debian13:nonroot AS runner

WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app/apps/auth-service/tb-auth-service /app/tb-auth-service
COPY --from=builder --chown=nonroot:nonroot /app/apps/auth-service/config /app/config
COPY --from=builder --chown=nonroot:nonroot /app/certs /etc/certs

ENV PORT=8080
EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/app/tb-auth-service"]