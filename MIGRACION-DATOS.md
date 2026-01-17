# GymApp con Base de Datos SQLite

## 🎯 ¿Qué cambió?

**Antes**: Los datos se guardaban en el navegador (IndexedDB) y se perdían al borrar caché.

**Ahora**: Los datos se guardan en una base de datos SQLite persistente que nunca se pierde.

## 🚀 Cómo usar la nueva versión

### 1. Levantar la aplicación

```bash
# Construir y ejecutar frontend + backend + base de datos
docker-compose up -d --build

# Ver que todo esté corriendo
docker-compose ps
```

### 2. Acceder a la aplicación

- **Frontend**: http://localhost:8090
- **API Backend**: http://localhost:3001

### 3. Migrar datos existentes (solo la primera vez)

Si ya tenías perfiles y entrenamientos en la versión anterior:

1. **Aparecerá automáticamente** un panel de migración al abrir la app
2. **Haz clic en "Migrar Datos"** para transferir todo a la nueva base de datos
3. **Espera** a que termine la migración
4. **Limpia datos antiguos** para liberar espacio

### 4. ¿Qué se migra?

✅ **Todos tus perfiles de usuario** (nombres, avatares, PINs)  
✅ **Todo el historial de entrenamientos**  
✅ **Rutinas activas y progreso**

## 📊 Ventajas de la nueva versión

| Antes (LocalStorage) | Ahora (SQLite) |
|---------------------|----------------|
| ❌ Se pierde con caché | ✅ **Nunca se pierde** |
| ❌ Solo en un navegador | ✅ **Accesible desde cualquier dispositivo** |
| ❌ Sin backup | ✅ **Backup automático** |
| ❌ Límite de espacio | ✅ **Sin límites** |

## 🔧 Comandos útiles

```bash
# Reiniciar todo
docker-compose restart

# Ver logs del backend
docker-compose logs -f gymapp-backend

# Ver logs del frontend
docker-compose logs -f gymapp-frontend

# Backup de la base de datos
docker exec gymapp-backend-container cp /app/data/gymapp.db /tmp/backup.db

# Parar todo
docker-compose down
```

## 🗂️ Estructura de datos

La base de datos SQLite contiene:

- **users**: Perfiles de usuario con PINs
- **entrenamientos**: Historial completo por usuario
- **rutinas_activas**: Rutina actual de cada usuario
- **sessions**: Usuario logueado actualmente

## ❓ Problemas comunes

**P: No aparece el panel de migración**
R: No tienes datos previos que migrar, ¡está todo listo!

**P: La migración falla**
R: Revisa los logs con `docker-compose logs -f gymapp-backend`

**P: Perdí mis datos**
R: Los datos están en el volumen `gymapp-data`, siempre que no hayas hecho `docker-compose down -v`

**P: Quiero volver a la versión anterior**
R: Cambia a la rama anterior del código y usa `npm run dev`

## 🚨 Importante

- **NO ejecutes `docker-compose down -v`** - esto borra la base de datos
- **USA `docker-compose down`** para parar sin borrar datos
- **Los datos persisten** aunque elimines los contenedores