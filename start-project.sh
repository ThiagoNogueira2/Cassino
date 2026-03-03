#!/bin/bash

# Script para iniciar todo o projeto (Backend + Frontend)
# Uso: ./start-project.sh

echo "🚀 Iniciando projeto Cassino..."
echo ""

# 1. Iniciar Backend Docker (app, postgres, redis, reverb)
echo "📦 Iniciando Backend Docker..."
cd backend
docker-compose up -d
sleep 5

# 2. Iniciar Game Loop (roda dentro do container app)
echo "🎮 Iniciando Crash Game Loop..."
docker-compose exec -Td app php artisan game:crash-loop &
sleep 2

cd ..

# 3. Iniciar Frontend em background
echo "🎨 Iniciando Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Projeto iniciado!"
echo ""
echo "📍 Acessos:"
echo "   - Frontend: http://localhost:8080"
echo "   - API: http://localhost:8000"
echo "   - WebSocket: ws://localhost:6003"
echo ""
echo "📝 Logs em tempo real:"
echo "   cd backend && docker-compose logs -f"
echo ""
echo "🛑 Para parar o frontend: kill $FRONTEND_PID"
echo "🛑 Para parar o backend: cd backend && docker-compose down"
echo ""

# Manter o script rodando
wait $FRONTEND_PID
