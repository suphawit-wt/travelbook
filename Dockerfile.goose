FROM golang:1.26-alpine AS builder
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

FROM alpine:3.23
COPY --from=builder /go/bin/goose /usr/local/bin/goose
COPY ./apps/auth-service/db/migrations /migrations
ENTRYPOINT ["goose"]