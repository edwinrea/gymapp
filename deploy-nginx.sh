#!/bin/bash

# Script de deployment para GymApp con Nginx Proxy
# Uso: ./deploy-nginx.sh

set -e

echo "🚀 Deployando GymApp con Nginx Proxy..."

# 1. Reconstruir contenedores
echo "🔨 Reconstruyendo contenedores..."
docker compose down
docker compose build --no-cache
docker compose up -d

# 2. Verificar que los servicios estén corriendo
echo "⏳ Esperando que los servicios inicien..."
sleep 10

# 3. Verificar servicios locales
echo "🔍 Verificando servicios locales..."
if curl -f -s "http://localhost:8081/api/health" > /dev/null; then
    echo "✅ Backend funcionando en puerto 8081"
else
    echo "❌ Backend no responde en puerto 8081"
    exit 1
fi

if curl -f -s "http://localhost:8080" > /dev/null; then
    echo "✅ Frontend funcionando en puerto 8080"
else
    echo "❌ Frontend no responde en puerto 8080"
    exit 1
fi

# 4. Instrucciones para Nginx
echo ""
echo "📋 CONFIGURACIÓN DE NGINX:"
echo "1. Copia la configuración de nginx:"
echo "   sudo cp nginx-gym.conf /etc/nginx/sites-available/gym.shutils.com"
echo "   sudo ln -s /etc/nginx/sites-available/gym.shutils.com /etc/nginx/sites-enabled/"
echo ""
echo "2. Ajusta las rutas de certificados SSL en la configuración"
echo ""
echo "3. Prueba y recarga nginx:"
echo "   sudo nginx -t"
echo "   sudo systemctl reload nginx"
echo ""
echo "🌐 URLs de acceso:"
echo "   Dominio: https://gym.shutils.com"
echo "   Local:   http://localhost:8080"
echo "   API:     http://localhost:8081/api/health"
echo ""
echo "✅ Deployment completo!"