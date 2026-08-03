FROM golang:1.26-trixie AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

COPY . .

WORKDIR /app/apps/search-consumer

RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    CGO_ENABLED=1 GOOS=linux go build \
    -trimpath \ 
    -ldflags="-s -w" \
    -o tb-search-consumer ./cmd/server

FROM gcr.io/distroless/cc-debian13:nonroot

WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app/apps/search-consumer/tb-search-consumer .
COPY --from=builder --chown=nonroot:nonroot /app/apps/search-consumer/config ./config

ENV PORT=8080
EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/app/tb-search-consumer"]