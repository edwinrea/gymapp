#!/bin/bash

# Script de deployment para servidor remoto
# Uso: ./deploy.sh [IP_SERVIDOR]

set -e

# Obtener IP del servidor (parámetro o detectar automáticamente)
SERVER_IP=${1:-$(hostname -I | awk '{print $1}')}

echo "🚀 Deployando GymApp en servidor: $SERVER_IP"

# Configurar variable de entorno para la API
export API_URL="http://${SERVER_IP}:8081"

echo "📡 Configurando API URL: $API_URL"

# Reconstruir y desplegar
echo "🔨 Reconstruyendo contenedores..."
docker compose down -v
docker compose build --no-cache
docker compose up -d

echo "✅ Deployment completo!"
echo "📱 Frontend: http://${SERVER_IP}:8080"
echo "🔌 Backend:  http://${SERVER_IP}:8081"

# Verificar que los servicios respondan
echo "🔍 Verificando servicios..."
sleep 5

if curl -f -s "http://${SERVER_IP}:8081/api/health" > /dev/null; then
    echo "✅ Backend funcionando"
else
    echo "❌ Backend no responde"
fi

if curl -f -s "http://${SERVER_IP}:8080" > /dev/null; then
    echo "✅ Frontend funcionando"
else
    echo "❌ Frontend no responde"
fi

echo ""
echo "🌐 URLs de acceso:"
echo "   Frontend: http://${SERVER_IP}:8080"
echo "   Backend:  http://${SERVER_IP}:8081"