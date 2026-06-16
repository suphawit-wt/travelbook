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

lint-auth-service:
	golangci-lint run --fix ./apps/auth-service/...

test-auth-service:
	go test -v ./apps/auth-service/...

swag-auth:
	swag init -d apps/auth-service -g cmd/http/main.go -o apps/auth-service/docs