FROM golang:1.27-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git ca-certificates

COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

COPY . .

WORKDIR /app/apps/property-service

RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    CGO_ENABLED=0 GOOS=linux go build \
    -trimpath \ 
    -ldflags="-s -w" \
    -o tb-property-service ./cmd/http

FROM gcr.io/distroless/static-debian13:nonroot AS runner

WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app/apps/property-service/tb-property-service /app/tb-property-service
COPY --from=builder --chown=nonroot:nonroot /app/apps/property-service/config /app/config
COPY --from=builder --chown=nonroot:nonroot /app/certs /etc/certs

ENV PORT=8080
EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/app/tb-property-service"]