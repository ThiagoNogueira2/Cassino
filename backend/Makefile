# Makefile - Comandos rápidos para desenvolvimento

.PHONY: help start stop logs shell migrate seed fresh test lint format

help:
	@echo "🎲 Velvet Stake Hub - Comandos disponíveis:"
	@echo ""
	@echo "make start          - Iniciar backend com Docker"
	@echo "make stop           - Parar backend"
	@echo "make logs           - Ver logs em tempo real"
	@echo "make shell          - Entrar no container (bash)"
	@echo "make migrate        - Rodar migrations"
	@echo "make seed           - Seed do banco (se disponível)"
	@echo "make fresh          - Reset do banco (migrate:fresh)"
	@echo "make test           - Rodar testes"
	@echo "make lint           - Verificar code style (pint)"
	@echo "make format         - Formatar código"
	@echo "make artisan        - Executar comando artisan (make artisan cmd='migrate')"
	@echo "make composer       - Executar comando composer (make composer cmd='require package')"
	@echo ""

start:
	chmod +x docker-*.sh
	./docker-start.sh

stop:
	./docker-stop.sh

logs:
	./docker-logs.sh

shell:
	docker-compose exec app sh

migrate:
	./docker-artisan.sh migrate

seed:
	./docker-artisan.sh db:seed

fresh:
	./docker-artisan.sh migrate:fresh

test:
	docker-compose exec app php artisan test

lint:
	docker-compose exec app ./vendor/bin/pint --check

format:
	docker-compose exec app ./vendor/bin/pint

artisan:
	./docker-artisan.sh $(cmd)

composer:
	./docker-composer.sh $(cmd)

# Aliases úteis
restart: stop start
	
restart-mysql:
	docker-compose restart mysql

ps:
	docker-compose ps

down:
	docker-compose down

clean:
	docker-compose down -v

.DEFAULT_GOAL := help
