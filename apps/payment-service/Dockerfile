FROM golang:1.27-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git ca-certificates

COPY . .

WORKDIR /app/apps/payment-service

RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    CGO_ENABLED=0 GOOS=linux go build \
    -trimpath \ 
    -ldflags="-s -w" \
    -o tb-payment-service ./cmd/http
    
FROM gcr.io/distroless/static-debian13:nonroot AS runner

WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app/apps/payment-service/tb-payment-service /app/tb-payment-service
COPY --from=builder --chown=nonroot:nonroot /app/apps/payment-service/config /app/config
COPY --from=builder --chown=nonroot:nonroot /app/certs /etc/certs

ENV PORT=8080
EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/app/tb-payment-service"]