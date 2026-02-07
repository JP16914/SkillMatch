.PHONY: install dev build test infra-up infra-down clean seed

install:
	pnpm install

infra-up:
	docker compose -f infra/docker-compose.yml up -d

infra-down:
	docker compose -f infra/docker-compose.yml down

dev:
	pnpm dev

build:
	pnpm build

test:
	pnpm test

seed:
	cd apps/api && npx prisma db seed

clean:
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name "dist" -type d -prune -exec rm -rf '{}' +
	find . -name ".next" -type d -prune -exec rm -rf '{}' +
