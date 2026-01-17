# Changelog

## [1.1.0] - 2026-01-16

### 🎉 Added - Integración ExerciseDB API

#### Nuevas Funcionalidades
- **ExerciseDB API Integration**: Acceso a +11,000 ejercicios con videos, GIFs e imágenes
- **Sistema Híbrido**: Combina catálogo local (15+ ejercicios) con API opcional
- **Búsqueda Inteligente**: Busca simultáneamente en catálogo local y API
- **Cache Temporal**: Implementación de cache de 50 minutos respetando términos de uso
- **Estado de API**: Indicadores visuales de conectividad y disponibilidad
- **Ejercicios Similares**: Recomendaciones basadas en grupo muscular (solo API)

#### Archivos Nuevos
- `src/services/exerciseDBAPI.js` - Cliente API principal
- `docs/EXERCISEDB_API.md` - Documentación completa de integración
- `src/examples/ejerciciosExamples.js` - 7 ejemplos prácticos de uso
- `scripts/test-api.js` - Script de verificación de configuración
- `.env.example` - Template de configuración
- `INTEGRATION_COMPLETE.md` - Resumen de integración

#### Archivos Modificados
- `src/services/ejercicios.js` - Ahora soporta búsqueda híbrida local+API
- `src/components/CatalogoEjercicios.jsx` - Búsqueda en tiempo real y estado API
- `src/components/CatalogoEjercicios.css` - Estilos para nuevas funcionalidades
- `.gitignore` - Excluye archivos .env
- `README.md` - Instrucciones de configuración de API
- `package.json` - Script `npm run test:api`

#### Mejoras de UX
- Banner de estado verde cuando API está conectada
- Banner informativo azul cuando solo hay catálogo local
- Badge "API" en ejercicios externos
- Barra de búsqueda funcional
- Loading states apropiados
- Soporte para múltiples formatos de media (video, GIF, thumbnails, imágenes)

#### Características Técnicas
- **Cache Management**: Limpieza automática cada 10 minutos
- **Fallback Automático**: Si API falla, usa catálogo local
- **Normalización de Datos**: Convierte formato API a formato interno
- **Mapeo de Grupos Musculares**: Español ↔ Inglés
- **Error Handling**: Manejo robusto de errores de red
- **Backward Compatibility**: Código existente sigue funcionando

#### Documentación
- Guía completa de integración (docs/EXERCISEDB_API.md)
- 7 ejemplos de código prácticos
- Instrucciones de troubleshooting
- Términos de uso y restricciones
- Mejores prácticas

### 🔒 Security
- Variables de entorno para API keys
- .env excluido de Git
- Sin almacenamiento permanente de contenido de API

### 📝 Documentation
- README actualizado con instrucciones de configuración
- Nueva documentación en `/docs`
- Ejemplos de código en `/examples`
- Comentarios JSDoc en servicios

### 🐛 Bug Fixes
- N/A (nueva funcionalidad)

---

## [1.0.0] - 2024-XX-XX

### Added
- Sistema de registro de entrenamientos
- Historial de entrenamientos
- Catálogo local de 15+ ejercicios
- Sistema de rutinas personalizadas
- Almacenamiento local con IndexedDB (localForage)
- PWA con soporte offline
- Navegación mobile-first
- VideoPlayer component
- Generador de rutinas inteligente

### Technical Stack
- React 18 + Vite
- React Router v6
- LocalForage (IndexedDB)
- Vite PWA Plugin
- CSS Vanilla con custom properties

---

## Formato del Changelog

Este changelog sigue el formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y el proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

### Tipos de cambios
- `Added` - Nuevas funcionalidades
- `Changed` - Cambios en funcionalidad existente
- `Deprecated` - Funcionalidades que serán removidas
- `Removed` - Funcionalidades removidas
- `Fixed` - Corrección de bugs
- `Security` - Cambios de seguridad
