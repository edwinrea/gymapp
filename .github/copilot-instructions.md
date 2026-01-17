# Instrucciones para Agentes de IA - GymApp

## Resumen del Proyecto

**GymApp** es una PWA (Progressive Web App) móvil-first para registrar entrenamientos de gimnasio con sistema de rutinas inteligentes. Permite crear rutinas personalizadas, visualizar ejercicios con imágenes, y seguir progreso con almacenamiento local offline-first.

## Arquitectura

### Stack Tecnológico
- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Almacenamiento**: localForage (wrapper sobre IndexedDB)
- **PWA**: vite-plugin-pwa con Workbox
- **Estilo**: CSS vanilla con custom properties (sin frameworks CSS)

### Estructura de Carpetas
```
src/
├── components/       # Componentes React con co-located CSS
│   ├── Layout.jsx              # Layout principal con nav bottom (4 items)
│   ├── Home.jsx                # Dashboard con estadísticas y rutina activa
│   ├── NuevoEntrenamiento.jsx  # Formulario multi-step
│   ├── Historial.jsx           # Lista de entrenamientos
│   ├── DetalleEntrenamiento.jsx # Vista detallada de entrenamiento
│   ├── Rutinas.jsx             # Vista de rutina activa y progreso
│   ├── GeneradorRutinas.jsx    # Wizard para crear rutinas personalizadas
│   ├── RutinaDia.jsx           # Detalle de día de rutina con ejercicios
│   └── CatalogoEjercicios.jsx  # Catálogo completo con imágenes
├── hooks/           # Custom hooks de React
│   ├── useEntrenamientos.js    # Hook para CRUD de entrenamientos
│   └── useRutinaActiva.js      # Hook para gestión de rutina activa
├── services/        # Lógica de negocio y servicios
│   ├── storage.js              # Servicio de persistencia de entrenamientos
│   ├── rutinasStorage.js       # Servicio de persistencia de rutinas
│   └── ejercicios.js           # Base de datos de ejercicios y generador
├── App.jsx          # Configuración de rutas
└── main.jsx         # Entry point
```

## Modelo de Datos

### Entrenamientos
```javascript
{
  id: 1673891234567,  // timestamp como ID único
  fecha: "2024-01-16T10:30:00.000Z",  // ISO string
  ejercicios: [
    {
      nombre: "Press de banca",
      series: [
        { repeticiones: 10, peso: 60.5 },
        { repeticiones: 8, peso: 65 }
      ]
    }
  ]
}
```

### Rutinas
```javascript
{
  id: timestamp,
  nombre: "Hipertrofia - 4 días",
  objetivo: "hipertrofia",  // fuerza, hipertrofia, general
  nivel: "intermedio",
  diasSemana: 4,
  descripcion: "...",
  fechaInicio: ISO string,
  dias: [
    {
      nombre: "Día 1 - Pecho y Tríceps",
      ejercicios: ['press-banca', 'press-inclinado', ...],  // IDs
      series: [4, 4, 3],
      reps: [8, 10, 12]
    }
  ],
  progreso: [
    {
      nombreDia: "Día 1 - Pecho y Tríceps",
      completado: false,
      entrenamientos: [],  // IDs de entrenamientos realizados
      ultimaFecha: ISO string
    }
  ]
}
```

### Ejercicios
Catálogo en [src/services/ejercicios.js](src/services/ejercicios.js) con:
- **15+ ejercicios predefinidos** con nombre, grupo muscular, dificultad
- **URLs de videos/GIFs animados** (ExerciseDB API v2)
- **Thumbnails** para preview rápido
- **Instrucciones paso a paso**
- **Rango recomendado** de series y repeticiones

**Clave de almacenamiento**: 
- Entrenamientos: `entrenamiento_${id}` en store `entrenamientos`
- Rutinas: `rutina_activa` y `rutina_historial_${id}` en store `rutinas`

## Convenciones Clave

### Componentes y Estilos
- **Co-located CSS**: Cada componente `.jsx` tiene su `.css` en el mismo directorio
- **Naming**: PascalCase para componentes, kebab-case para clases CSS
- **Mobile-first**: Todos los estilos base son para móvil, media queries para desktop (`@media (min-width: 768px)`)

### Estado y Datos
- **Custom hooks**: La lógica de estado compleja vive en hooks (`useEntrenamientos`)
- **No Redux**: Estado local con `useState` + context via hooks
- **Persistencia**: Siempre usar `storageService`, nunca acceder a localStorage directamente
- **IDs**: Usar `Date.now()` para generar IDs únicos (timestamp)

### Navegación
- **Rutas principales**:
  - `/` - Home (dashboard con rutina activa si existe)
  - `/rutinas` - Vista de rutina activa y progreso
  - `/generar-rutina` - Wizard para crear rutina personalizada
  - `/rutina-dia/:indiceDia` - Detalle de día específico con ejercicios e imágenes
  - `/catalogo-ejercicios` - Catálogo completo filtrable por grupo muscular
  - `/nuevo` - Formulario de nuevo entrenamiento
  - `/historial` - Lista de entrenamientos
  - `/entrenamiento/:id` - Detalle de entrenamiento
- **Navegación bottom**: Fixed bottom nav con 4 items (Home, Rutinas, Nuevo, Historial)

### Estilos
- **Variables CSS**: Definidas en [src/index.css](src/index.css) bajo `:root`
  - Colores: `--primary`, `--text-primary`, `--bg-primary`, etc.
  - Usar siempre variables, no colores hardcoded
- **Botones**: Clases `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-large`
- **Cards**: `.card` con `box-shadow: var(--shadow)` y `border-radius: 8-12px`

## Workflows de Desarrollo

### Iniciar el proyecto
```bash
npm install
npm run dev  # Abre en http://localhost:3000
```

### Build y preview
```bash
npm run build    # Build de producción en /dist
npm run preview  # Preview del build
```

### Agregar componente nuevo
1. Crear `ComponenteNuevo.jsx` y `ComponenteNuevo.css` en `src/components/`
2. Importar estilos dentro del componente: `import './ComponenteNuevo.css'`
3. Si requiere datos, usar o extender `useEntrenamientos` hook
4. Agregar ruta en [src/App.jsx](src/App.jsx) si es una página

### Modificar modelo de datos
1. Actualizar interfaz en [src/services/storage.js](src/services/storage.js)
2. Migrar datos existentes si es breaking change
3. Actualizar tipos en comentarios JSDoc
**Entrenamientos**: Todo el acceso a datos va a través de `storageService`:
```javascript
import { storageService } from '../services/storage'
await storageService.guardarEntrenamiento({ ejercicios, fecha })
const entrenamientos = await storageService.obtenerEntrenamientos()
```

**Rutinas**: Usar `rutinasStorageService`:
```javascript
import { rutinasStorageService } from '../services/rutinasStorage'
await rutinasStorageService.guardarRutinaActiva(rutina)
const rutina = await rutinasStorageService.obtenerRutinaActiva()
```

**Ejercicios**: Catálogo y generador en `ejerciciosService`:
```javascript
import { ejerciciosService } from '../services/ejercicios'
const ejercicio = ejerciciosService.obtenerPorId('press-banca')
const rutina = ejerciciosService.generarRutina({ 
  objetivo: 'hipertrofia', 
  nivel: 'intermedio',
  diasSemana: 4,
  equipamiento: ['barra', 'mancuernas']
})
```

### Custom Hook Pattern
**useEntrenamientos**: CRUD de entrenamientos
```javascript
const { entrenamientos, loading, agregarEntrenamiento } = useEntrenamientos()
```

**useRutinaActiva**: Gestión de rutina activa
```javascript
const { rutinaActiva, estadisticas, iniciarRutina, marcarDiaCompletado } = useRutinaActiva
### Custom Hook Pattern
`useEntrenamientos` encapsula lógica de estado + servicio:
```javascript
const { entrenamientos, loading, agregarEntrenamiento } = useEntrenamientos()
```

### Form State Pattern
Formularios complejos usan estado local con objetos nested:
```javascript
const [ejercicioActual, setEjercicioActual] = useState({
  nombre: '',
  series: [{ repeticiones: '', peso: '' }]
})
```

### Navigation Pattern
Siempre usar `react-router-dom` hooks:
```javascript
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()array `ejerciciosDB` en [src/services/ejercicios.js](src/services/ejercicios.js). Incluir: id único, nombre, grupoMuscular, gruposSecundarios, dificultad, equipamiento, imagen (URL ExerciseDB), instrucciones, rangos de series/reps.

**Agregar nueva plantilla de rutina**: Editar objeto `rutinasTemplates` en [src/services/ejercicios.js](src/services/ejercicios.js). Incluir: nombre, objetivo, nivel, diasSemana, descripción, array de días con ejercicios/series/reps.

**Modificar imágenes de ejercicios**: Reemplazar URLs en propiedad `imagen` de ejerciciosDB. Formato preferido: URLs de ExerciseDB API o assets locales en `/public`.

**Agregar gráficos de progreso**: Crear componente en `src/components/Graficos.jsx`, usar datos de `storageService.obtenerEstadisticas()` y progreso de `rutinasStorageService.obtenerEstadisticas()`.

**Cambiar tema de colores**: Modificar variables CSS en [src/index.css](src/index.css) bajo `:root`.

**Sincronización en la nube**: Implementar nuevo servicio `src/services/sync.js` que lea/escriba de `storageService` y `rutinasStorageService`, sincronice con API externa.

## Consideraciones PWA

- **Service Worker**: Auto-generado por vite-plugin-pwa
- **Manifest**: Configurado en [vite.config.js](vite.config.js)
- **Offline**: La app funciona completamente offline después de la primera carga
- **Install prompt**: Manejado automáticamente por el navegador

## Testing

Actualmente no hay tests configurados. Al agregar tests:
- Usar Vitest (ya incluido con Vite)
- Testing Library para componentes React
- Mock `localforage` en tests
