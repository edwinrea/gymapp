# Migración a Base de Datos - GymApp

## ✅ ¿Qué se ha migrado?

La aplicación GymApp ha sido **completamente migrada** de almacenamiento local (localforage/IndexedDB) a una **base de datos SQLite** con backend Express.

### Cambios Realizados

1. **Backend SQLite** (`backend/server.js`)
   - Base de datos SQLite con tablas: `users`, `sessions`, `entrenamientos`, `rutinas_activas`, `rutinas_historial`
   - API REST completa con endpoints para todas las operaciones CRUD
   - Soporte multi-usuario con sesiones

2. **Servicios Frontend Migrados**
   - `storageService` → Ahora usa `storageAPI.js`
   - `rutinasStorageService` → Ahora usa `rutinasStorageAPI.js` 
   - `userService` → Ya usa API desde el principio

3. **Funciones Mantenidas**
   - Todas las funciones originales están disponibles
   - Compatibilidad completa con componentes existentes
   - Misma estructura de datos

## 🚀 Cómo Ejecutar con Base de Datos

### 1. Instalar Dependencias del Backend
```bash
npm run setup
```

### 2. Crear Archivo de Entorno
```bash
cp .env.example .env
```

### 3. Ejecutar Frontend + Backend Simultáneamente
```bash
npm run dev:full
```

### 4. Solo Backend (para desarrollo)
```bash
npm run dev:backend
```

### 5. Solo Frontend (modo original)
```bash
npm run dev
```

## 📊 Estructura de Base de Datos

### Tabla `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- Timestamp único
  nombre TEXT NOT NULL,          -- Nombre del usuario
  avatar TEXT DEFAULT '👤',      -- Emoji avatar
  pin TEXT NULL,                 -- PIN de 4 dígitos (opcional)
  fecha_creacion TEXT NOT NULL,  -- ISO timestamp
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Tabla `entrenamientos`
```sql
CREATE TABLE entrenamientos (
  id INTEGER PRIMARY KEY,        -- Timestamp del entrenamiento
  user_id TEXT NOT NULL,         -- Relación con users.id
  fecha TEXT NOT NULL,           -- ISO timestamp del entrenamiento
  ejercicios TEXT NOT NULL,      -- JSON de ejercicios y series
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
)
```

### Tabla `rutinas_activas`
```sql
CREATE TABLE rutinas_activas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,  -- Un usuario = una rutina activa
  rutina_data TEXT NOT NULL,     -- JSON completo de la rutina
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
)
```

## 🔄 Migración de Datos Existentes

Si tienes datos en localforage que quieres migrar, se puede implementar una función de migración:

1. **Datos de Usuarios**: Se pueden exportar y re-importar manualmente
2. **Entrenamientos**: La función `migrarDatosLocal()` en `storageAPI.js` está preparada para esto
3. **Rutinas**: Similar función en `rutinasStorageAPI.js`

## 📡 API Endpoints

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear nuevo usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Sesiones
- `GET /api/session` - Obtener usuario actual
- `POST /api/session` - Establecer usuario actual
- `DELETE /api/session` - Cerrar sesión

### Entrenamientos
- `GET /api/entrenamientos/:userId` - Obtener entrenamientos del usuario
- `GET /api/entrenamientos/:userId/:id` - Obtener entrenamiento específico
- `POST /api/entrenamientos/:userId` - Crear/actualizar entrenamiento
- `DELETE /api/entrenamientos/:userId/:id` - Eliminar entrenamiento

### Rutinas
- `GET /api/rutina-activa/:userId` - Obtener rutina activa
- `PUT /api/rutina-activa/:userId` - Guardar rutina activa
- `DELETE /api/rutina-activa/:userId` - Eliminar rutina activa

## 🛠️ Configuración de Entorno

### Variables Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001  # URL del backend
```

### Variables Backend
```bash
PORT=3001                          # Puerto del servidor
FRONTEND_URL=http://localhost:8090  # URL del frontend (CORS)
```

## 🔧 Troubleshooting

### Error de Conexión a la API
1. Verificar que el backend esté ejecutándose: `npm run dev:backend`
2. Verificar URL en `.env`: `VITE_API_URL=http://localhost:3001`
3. Verificar que no haya conflictos de puertos

### Base de Datos No se Crea
1. Verificar permisos en carpeta `backend/data/`
2. Instalar dependencias del backend: `cd backend && npm install`

### Datos No se Guardan
1. Verificar que hay un usuario logueado (pantalla de selección de usuario)
2. Verificar conexión de red al backend
3. Revisar consola para errores de API

## 🎯 Ventajas de la Migración

1. **Multi-usuario**: Múltiples usuarios pueden usar la aplicación
2. **Persistencia**: Datos se mantienen entre dispositivos
3. **Backup**: Base de datos SQLite fácil de respaldar
4. **Escalabilidad**: Preparado para crecer (PostgreSQL, cloud, etc.)
5. **Sincronización**: Base para futura sync multi-dispositivo

## ⚡ Modo de Compatibilidad

Los archivos originales `storage.js` y `rutinasStorage.js` ahora son **wrappers** que redirigen a las versiones de API, manteniendo compatibilidad total con componentes existentes.

**¡La migración es transparente para el usuario final!**