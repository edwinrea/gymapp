# 🐳 Docker Setup - GymApp

Este archivo documenta cómo ejecutar GymApp usando Docker Compose con frontend y backend integrados.

## 🚀 Inicio Rápido

### 1. Construir y ejecutar con Docker Compose

```bash
# Construir las imágenes y levantar servicios
npm run docker:build && npm run docker:up

# O manualmente:
docker-compose up --build -d
```

### 2. Verificar que esté funcionando

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health check**: http://localhost:3001/api/health

### 3. Ver logs

```bash
npm run docker:logs

# O específico por servicio:
docker-compose logs -f frontend
docker-compose logs -f backend
```

## 📋 Comandos Disponibles

```bash
npm run docker:up       # Levantar servicios en background
npm run docker:down     # Detener y limpiar servicios
npm run docker:build    # Reconstruir imágenes
npm run docker:logs     # Ver logs de todos los servicios
npm run docker:restart  # Reiniciar servicios
```

## 🏗️ Arquitectura Docker

### Frontend Container
- **Puerto**: 3000
- **Imagen**: Node.js 18 Alpine
- **Comando**: `npm run dev -- --host 0.0.0.0`
- **Volúmenes**: Hot reload habilitado
- **Variables**: 
  - `HOST=0.0.0.0` (binding)
  - `VITE_API_URL=http://localhost:3001`

### Backend Container
- **Puerto**: 3001
- **Imagen**: Node.js 18 Alpine  
- **Comando**: `node server.js`
- **Base de datos**: SQLite en volumen persistente
- **Variables**:
  - `NODE_ENV=development`
  - `PORT=3001`
  - `FRONTEND_URL=http://localhost:3000`

### Red y Volúmenes
- **Red**: `gymapp-network` (bridge)
- **Volumen**: `backend_data` para persistir SQLite
- **Hot Reload**: Habilitado en ambos servicios

## 🔧 Desarrollo

### Modificar código
Los cambios en el código se reflejan automáticamente gracias a los volúmenes montados:
- Frontend: Hot reload con Vite
- Backend: Reinicio automático con nodemon (si se configura)

### Variables de entorno
Las variables están configuradas en el `docker-compose.yml`. Para cambios:

1. Modifica `docker-compose.yml`
2. Reinicia: `npm run docker:restart`

### Base de datos
La base de datos SQLite se almacena en el volumen `backend_data` y persiste entre reinicios.

### Acceso a logs
```bash
# Logs en tiempo real
docker-compose logs -f

# Solo frontend
docker-compose logs -f frontend

# Solo backend  
docker-compose logs -f backend
```

## 🐛 Troubleshooting

### Error de conexión CORS
Si el frontend no puede conectar al backend:
1. Verifica que ambos servicios estén corriendo
2. Revisa los logs del backend
3. Confirma variables `VITE_API_URL` y `FRONTEND_URL`

### Base de datos no persiste
```bash
# Verificar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect gymapp_backend_data
```

### Puertos ocupados
```bash
# Liberar puertos
docker-compose down
sudo lsof -i :3000
sudo lsof -i :3001
```

### Reconstruir desde cero
```bash
# Limpiar todo y rebuildecar
docker-compose down -v
docker system prune -f
npm run docker:build
npm run docker:up
```

## 🔄 Migración de desarrollo local

Para migrar de desarrollo local a Docker:

1. **Detener servicios locales**:
   ```bash
   # Detener si hay procesos corriendo
   pkill -f "node server.js"
   pkill -f "npm run dev"
   ```

2. **Levantar con Docker**:
   ```bash
   npm run docker:up
   ```

3. **Verificar funcionamiento**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001/api/health

## ⚡ Modo de producción

Para un build de producción con Docker:

```bash
# TODO: Implementar build optimizado
# - Multi-stage builds
# - Nginx para servir frontend estático
# - Variables de entorno de producción
```

---

## 📝 Notas

- Los archivos `.dockerignore` optimizan el build excluyendo archivos innecesarios
- La red `gymapp-network` permite comunicación entre contenedores
- El volumen `backend_data` persiste la base de datos SQLite
- Hot reload está habilitado para desarrollo ágil