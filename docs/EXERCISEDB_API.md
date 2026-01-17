# Integración ExerciseDB API

## 🎯 Descripción

GymApp ahora soporta integración con **ExerciseDB API** de RapidAPI, que proporciona acceso a más de 11,000 ejercicios con videos, GIFs e imágenes de alta calidad.

## 🔄 Sistema Híbrido

La aplicación funciona en modo híbrido:

- **Catálogo Local** (15+ ejercicios): Disponible offline, sin configuración adicional
- **ExerciseDB API** (11,000+ ejercicios): Requiere API key, acceso en tiempo real a contenido multimedia

## 📋 Configuración

### Paso 1: Obtener API Key

1. Regístrate en [RapidAPI](https://rapidapi.com/auth/sign-up)
2. Visita la [página de ExerciseDB API](https://rapidapi.com/ascendapi/api/exercise-db-with-videos-and-images-by-ascendapi)
3. Suscríbete a un plan:
   - **BASIC**: $0/mes - 100 requests/día (ideal para desarrollo)
   - **MEGA**: $0/mes - 500 requests/día
   - **PRO**: $100/mes - 50,000 requests/mes (producción)
4. Copia tu API Key desde el dashboard

### Paso 2: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita `.env` y agrega tu API key:
```
VITE_RAPIDAPI_KEY=tu-api-key-aqui
```

3. Reinicia el servidor de desarrollo:
```bash
npm run dev
```

## 🚀 Funcionalidades

### Búsqueda de Ejercicios

```javascript
import { ejerciciosService } from './services/ejercicios'

// Buscar por término
const resultados = await ejerciciosService.buscarEjercicios('chest press', 20)

// Buscar por grupo muscular (automáticamente busca en API si está configurada)
const pecho = await ejerciciosService.obtenerPorGrupo('pecho', true)

// Obtener ejercicio por ID
const ejercicio = await ejerciciosService.obtenerPorId('press-banca')
```

### Ejercicios Similares

```javascript
// Obtener ejercicios similares basados en grupo muscular
const similares = await ejerciciosService.obtenerSimilares('press-banca', 5)
```

### Verificar Estado de la API

```javascript
const estado = await ejerciciosService.verificarEstadoAPI()
console.log(estado.available) // true/false
```

## 📊 Estructura de Datos

Los ejercicios de la API se normalizan al formato interno:

```javascript
{
  id: "ejercicio-123",
  nombre: "Press de Banca",
  grupoMuscular: "pecho",
  gruposSecundarios: ["triceps", "hombros"],
  dificultad: "intermedio",
  equipamiento: "barra",
  descripcion: "...",
  
  // Contenido multimedia (solo de API, no se almacena)
  video: "https://...",
  videoSecundario: "https://...",
  gif: "https://...",
  thumbnail: "https://...",
  imagenes: ["https://...", "https://..."],
  
  instrucciones: ["Paso 1", "Paso 2", ...],
  seriesRecomendadas: { min: 3, max: 5 },
  repeticionesRecomendadas: { min: 8, max: 12 },
  
  // Metadata
  apiSource: "exercisedb",
  fetchedAt: "2024-01-16T..."
}
```

## ⚠️ Términos de Uso Importantes

La API de ExerciseDB tiene **restricciones estrictas**:

### ❌ PROHIBIDO

- ❌ Almacenar contenido localmente (videos, imágenes, textos)
- ❌ Cache permanente de datos
- ❌ Usar contenido después de cancelar suscripción
- ❌ Redistribuir o revender contenido

### ✅ PERMITIDO

- ✅ Cache temporal (< 1 hora) - implementado automáticamente
- ✅ Acceso en tiempo real durante suscripción activa
- ✅ Mostrar contenido directamente desde la API

**Nuestro servicio respeta estas restricciones:**
- Cache temporal de 50 minutos (automático)
- Limpieza automática cada 10 minutos
- No persistencia en localStorage/IndexedDB
- Fetch en tiempo real para cada visualización

## 🔧 API Endpoints Disponibles

### 1. Buscar Ejercicios
```javascript
searchExercises(query, limit, offset)
```

### 2. Listar Ejercicios
```javascript
getExercises({ limit, offset })
```

### 3. Obtener por ID
```javascript
getExerciseById(id)
```

### 4. Buscar por Grupo Muscular
```javascript
buscarPorGrupoMuscular(grupoMuscular, limit)
```

## 🎨 UI/UX

El catálogo muestra:
- Badge **"API"** en ejercicios externos
- Banner verde cuando API está conectada
- Banner azul cuando solo hay catálogo local
- Barra de búsqueda para explorar +11,000 ejercicios
- Videos/GIFs/imágenes en tiempo real

## 🐛 Troubleshooting

### La API no funciona

1. Verifica que `.env` exista y tenga `VITE_RAPIDAPI_KEY`
2. Verifica que la API key sea válida en RapidAPI dashboard
3. Comprueba que tienes requests disponibles en tu plan
4. Revisa la consola del navegador para errores

### No veo ejercicios de la API

- La app funciona sin API (catálogo local de 15+ ejercicios)
- Si quieres acceso a 11,000+ ejercicios, configura la API key
- Verifica conexión a internet

### Rate Limit Exceeded

- Estás superando tu límite de requests
- BASIC: 100/día, MEGA: 500/día
- Considera upgrade a PRO para 50,000/mes

## 📚 Recursos

- [Documentación oficial ExerciseDB](https://v2.exercisedb.dev)
- [RapidAPI Hub](https://rapidapi.com/hub)
- [Planes y precios](https://rapidapi.com/ascendapi/api/exercise-db-with-videos-and-images-by-ascendapi/pricing)

## 🔐 Seguridad

⚠️ **NUNCA** commitees tu `.env` al repositorio

El archivo `.gitignore` ya está configurado para excluir `.env`, pero verifica que tu API key nunca aparezca en:
- Commits de Git
- Screenshots públicos
- Issues de GitHub
- Código de frontend accesible

## 💡 Recomendaciones

1. **Desarrollo**: Usa plan BASIC (gratis, 100 req/día)
2. **Testing**: Usa plan MEGA (gratis, 500 req/día)
3. **Producción**: Considera PRO según tráfico esperado
4. **Cache**: El sistema ya implementa cache de 50min (máximo permitido)
5. **Offline**: La app funciona offline con catálogo local

## 📝 Licencia

El contenido de ExerciseDB API es propiedad de AscendAPI. Solo puedes usarlo durante tu suscripción activa. Lee los [términos completos](https://rapidapi.com/ascendapi/api/exercise-db-with-videos-and-images-by-ascendapi) antes de usar.
