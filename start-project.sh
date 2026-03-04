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

# 2. Um único Game Loop (mata qualquer um antigo e sobe um novo)
echo "🎮 Iniciando Crash Game Loop (único)..."
docker-compose exec -T app pkill -f "game:crash-loop" 2>/dev/null || true
sleep 1
docker-compose exec -Td app php artisan game:crash-loop
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
