# Configuración para Deployment - GymApp

## 🚀 Configuración de Puertos Personalizada

Esta configuración está optimizada para deployment en servidores con múltiples contenedores.

### Puertos Configurados:
- **Frontend**: http://localhost:8080 (puerto externo)
- **Backend API**: http://localhost:8081 (puerto externo)
- **Health Check**: http://localhost:8081/api/health

### Cambios Realizados:

1. **docker-compose.yml**:
   - Frontend: `8080:3000` (en lugar de `3002:3000`)
   - Backend: `8081:3001` (en lugar de `3001:3001`)

2. **Variables de Entorno**:
   - `VITE_API_URL=http://localhost:8081`
   - `FRONTEND_URL=http://localhost:8080`

3. **CORS Configurado** para permitir conexiones desde:
   - `http://localhost:8080` (nuevo frontend)
   - `http://localhost:8081` (nuevo backend)
   - Puertos originales mantenidos para desarrollo local

## 📋 Comandos para Deployment

```bash
# Detener servicios anteriores
docker compose down -v

# Construir con nuevas configuraciones
docker compose build --no-cache

# Levantar servicios en nuevos puertos
docker compose up -d

# Verificar que todo funciona
curl http://localhost:8081/api/health
curl -I http://localhost:8080
```

## 🔧 Personalización de Puertos

Si necesitas usar puertos diferentes, edita:

1. **docker-compose.yml**:
   ```yaml
   ports:
     - "TU_PUERTO_FRONTEND:3000"  # Frontend
     - "TU_PUERTO_BACKEND:3001"   # Backend
   ```

2. **Variables de entorno**:
   ```yaml
   environment:
     - VITE_API_URL=http://localhost:TU_PUERTO_BACKEND
     - FRONTEND_URL=http://localhost:TU_PUERTO_FRONTEND
   ```

3. **Archivo .env**:
   ```
   VITE_API_URL=http://localhost:TU_PUERTO_BACKEND
   FRONTEND_URL=http://localhost:TU_PUERTO_FRONTEND
   ```

## 🛡️ Verificación de Puertos

Antes del deployment, verifica que los puertos estén libres:

```bash
# Verificar puertos en uso
sudo netstat -tlnp | grep :8080
sudo netstat -tlnp | grep :8081

# O usando lsof
sudo lsof -i :8080
sudo lsof -i :8081
```

## 🔄 Rollback a Configuración Original

Si necesitas volver a los puertos originales:

```bash
git checkout -- docker-compose.yml .env
git checkout -- backend/server.js src/services/apiService.js
```