#!/bin/bash

# Script para executar comandos artisan
# Uso: ./docker-artisan.sh migrate

cd "$(dirname "$0")"

if [ $# -eq 0 ]; then
    echo "❌ Nenhum comando fornecido"
    echo "Uso: ./docker-artisan.sh [comando]"
    echo "Exemplos:"
    echo "  ./docker-artisan.sh migrate"
    echo "  ./docker-artisan.sh make:model User -m"
    echo "  ./docker-artisan.sh tinker"
    exit 1
fi

docker-compose exec app php artisan "$@"
