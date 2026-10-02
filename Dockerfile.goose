FROM golang:1.27-alpine AS builder
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

COPY ./certs /etc/certs

FROM alpine:3.24
COPY --from=builder /go/bin/goose /usr/local/bin/goose
COPY --from=builder /etc/certs /etc/certs
COPY ./apps/auth-service/db/migrations /migrations
ENTRYPOINT ["goose"]