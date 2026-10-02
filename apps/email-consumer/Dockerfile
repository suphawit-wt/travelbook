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

WORKDIR /app/apps/email-consumer

RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    CGO_ENABLED=1 GOOS=linux go build \
    -trimpath \ 
    -ldflags="-s -w" \
    -o tb-email-consumer ./cmd/server

FROM gcr.io/distroless/cc-debian13:nonroot

WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app/apps/email-consumer/tb-email-consumer /app/tb-email-consumer
COPY --from=builder --chown=nonroot:nonroot /app/apps/email-consumer/config /app/config

ENV PORT=8080
EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/app/tb-email-consumer"]