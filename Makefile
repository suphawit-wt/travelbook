.PHONY: init cluster cluster-down dev dev-web lint-web format-web dev-auth-service lint-auth-service test-auth-service swag-auth

init:
	lefthook install

cluster:
	bash ./scripts/setup-dev.sh

cluster-down:
	k3d cluster delete travelbook-cluster

dev:
	skaffold dev

dev-web:
	skaffold dev -m web

lint-web:
	cd apps/web && pnpm run lint

format-web:
	cd apps/web && pnpm run format

dev-auth-service:
	skaffold dev -m auth-service

dev-email-consumer:
	skaffold dev -m email-consumer

dev-user-consumer:
	skaffold dev -m user-consumer

dev-partner-consumer:
	skaffold dev -m partner-consumer

dev-user-service:
	skaffold dev -m user-service

dev-property-service:
	skaffold dev -m property-service

lint-auth-service:
	golangci-lint run --fix ./apps/auth-service/...

lint-email-consumer:
	golangci-lint run --fix ./apps/email-consumer/...

lint-user-consumer:
	golangci-lint run --fix ./apps/user-consumer/...

lint-partner-consumer:
	golangci-lint run --fix ./apps/partner-consumer/...

lint-user-service:
	golangci-lint run --fix ./apps/user-service/...

lint-property-service:
	golangci-lint run --fix ./apps/property-service/...

test-auth-service:
	go test -v ./apps/auth-service/...

test-email-consumer:
	go test -v ./apps/email-consumer/...

test-user-consumer:
	go test -v ./apps/user-consumer/...

test-partner-consumer:
	go test -v ./apps/partner-consumer/...

test-user-service:
	go test -v ./apps/user-service/...

test-property-service:
	go test -v ./apps/property-service/...

swag-auth:
	swag init -d apps/auth-service -g cmd/http/main.go -o apps/auth-service/docs

swag-user:
	swag init -d apps/user-service -g cmd/http/main.go -o apps/user-service/docs

swag-property:
	swag init -d apps/property-service -g cmd/http/main.go -o apps/property-service/docs