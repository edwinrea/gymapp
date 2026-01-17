# GymApp 💪

Aplicación web móvil (PWA) para registrar y seguir tu progreso en el gimnasio.

## Características

- 📱 Diseño mobile-first optimizado para uso en el gimnasio
- 🔌 Funciona offline (PWA con service worker)
- 💾 Almacenamiento local persistente (localForage)
- ⚡ Rápida y ligera (React + Vite)
- 📊 Registro de ejercicios, series, repeticiones y peso
- 📈 Historial de entrenamientos
- 🎯 Rutinas personalizadas inteligentes
- 🎬 **NUEVO**: Integración con ExerciseDB API (+11,000 ejercicios con videos)
- 🗄️ **NUEVO**: Base de datos SQLite con backend API
- 🐳 **NUEVO**: Docker Compose para desarrollo fácil

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

```bash
# Levantar frontend + backend con Docker
npm run docker:build && npm run docker:up

# Ver logs
npm run docker:logs
```

**Acceder a**:
- Frontend: http://localhost:3000  
- Backend: http://localhost:3001

📖 [Ver guía completa de Docker](DOCKER-README.md)

### Opción 2: Desarrollo Local

```bash
# Instalar dependencias
npm install && npm run setup

# Levantar frontend + backend simultáneamente
npm run dev:full

# O por separado:
npm run dev:backend  # Backend en puerto 3001
npm run dev          # Frontend en puerto 3000
```

### Opción 3: Solo Frontend (sin base de datos)

```bash
npm install
npm run dev
```

📖 [Ver guía de migración a base de datos](MIGRACION-BD.md)

La aplicación estará disponible en `http://localhost:3000`

## 🎬 Configuración de ExerciseDB API (Opcional)

Para acceder a +11,000 ejercicios con videos e imágenes:

1. Crea una cuenta en [RapidAPI](https://rapidapi.com)
2. Suscríbete a [ExerciseDB API](https://rapidapi.com/ascendapi/api/exercise-db-with-videos-and-images-by-ascendapi) (plan gratis disponible)
3. Copia tu API key
4. Crea un archivo `.env` en la raíz del proyecto:
```bash
VITE_RAPIDAPI_KEY=tu-api-key-aqui
```
5. Reinicia el servidor de desarrollo

**Nota**: La app funciona perfectamente sin la API (usa catálogo local de 15+ ejercicios). La API es opcional para acceso a contenido multimedia adicional.

📖 [Ver documentación completa de la API](docs/EXERCISEDB_API.md)

## Estructura del Proyecto

```
gymapp/
├── src/
│   ├── components/     # Componentes React
│   ├── hooks/         # Custom hooks
│   ├── services/      # Servicios (almacenamiento, API, etc.)
│   │   ├── storage.js           # Persistencia de entrenamientos
│   │   ├── rutinasStorage.js    # Persistencia de rutinas
│   │   ├── ejercicios.js        # Catálogo local + integración híbrida
│   │   └── exerciseDBAPI.js     # Cliente API ExerciseDB
│   ├── utils/         # Utilidades
│   ├── App.jsx        # Componente principal
│   └── main.jsx       # Entry point
├── public/            # Assets estáticos
├── docs/              # Documentación
│   └── EXERCISEDB_API.md  # Guía de integración API
└── index.html         # HTML template
```

## Tecnologías

- **React 18** - UI library
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **localForage** - Almacenamiento local mejorado (IndexedDB)
- **Vite PWA** - Progressive Web App
- **ExerciseDB API** - Base de datos de +11,000 ejercicios (opcional)

## Sistema Híbrido de Ejercicios

GymApp utiliza un sistema híbrido inteligente:

- **Catálogo Local** (15+ ejercicios): Disponible offline, sin configuración
- **ExerciseDB API** (11,000+ ejercicios): Videos, GIFs e imágenes en tiempo real

El sistema busca primero en el catálogo local y luego consulta la API si está configurada, garantizando funcionalidad offline completa.

## Modelo de Datos

Los entrenamientos se almacenan localmente con la siguiente estructura:

```javascript
{
  id: timestamp,
  fecha: ISO string,
  ejercicios: [
    {
      nombre: string,
      series: [
        { repeticiones: number, peso: number }
      ]
    }
  ]
}
```
