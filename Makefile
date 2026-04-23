.PHONY: init cluster cluster-down dev dev-web lint-web format-web

init:
	lefthook install && pnpm install

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