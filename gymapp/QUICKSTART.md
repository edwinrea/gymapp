# 🚀 Quick Start - ExerciseDB API

## ⚡ Setup en 2 Minutos

### 1. Obtener API Key
```bash
# 1. Ir a RapidAPI y registrarse
https://rapidapi.com/auth/sign-up

# 2. Ir a ExerciseDB API
https://rapidapi.com/ascendapi/api/exercise-db-with-videos-and-images-by-ascendapi

# 3. Elegir plan (BASIC o MEGA son gratis)
# 4. Copiar tu API Key
```

### 2. Configurar
```bash
# Copiar template
cp .env.example .env

# Editar .env y pegar tu key
echo "VITE_RAPIDAPI_KEY=tu-api-key-aqui" > .env

# Reiniciar servidor
npm run dev
```

### 3. Verificar
```bash
# Ejecutar test
npm run test:api

# O abrir el navegador
# http://localhost:3000
# Ir a "Catálogo de Ejercicios"
# Ver banner verde = ✅ Conectado
```

---

## 🎯 Uso Básico

### Buscar Ejercicios
```javascript
import { ejerciciosService } from './services/ejercicios'

// Buscar por término
const results = await ejerciciosService.buscarEjercicios('press')

// Por grupo muscular
const pecho = await ejerciciosService.obtenerPorGrupo('pecho', true)

// Por ID
const ejercicio = await ejerciciosService.obtenerPorId('press-banca')
```

### En un Componente
```jsx
function MiComponente() {
  const [ejercicios, setEjercicios] = useState([])

  useEffect(() => {
    ejerciciosService.buscarEjercicios('chest').then(setEjercicios)
  }, [])

  return (
    <ul>
      {ejercicios.map(ej => (
        <li key={ej.id}>
          {ej.nombre}
          {ej.video && <video src={ej.video} />}
        </li>
      ))}
    </ul>
  )
}
```

---

## 📊 Datos que Recibes

```javascript
{
  id: "press-banca",
  nombre: "Press de Banca",
  grupoMuscular: "pecho",
  dificultad: "intermedio",
  video: "https://...",       // ⚠️ No almacenar
  gif: "https://...",          // ⚠️ No almacenar
  thumbnail: "https://...",    // ⚠️ No almacenar
  instrucciones: ["...", "..."]
}
```

---

## ⚠️ Importantes

### ✅ HACER
- ✅ Usar directamente en el render
- ✅ Cache temporal automático (< 1h)
- ✅ Buscar en tiempo real
- ✅ Verificar estado API antes de usar

### ❌ NO HACER
- ❌ Almacenar en IndexedDB/localStorage
- ❌ Guardar videos/imágenes localmente
- ❌ Usar después de cancelar suscripción
- ❌ Cache permanente

---

## 🐛 Problemas Comunes

### "API key no configurada"
```bash
# Solución
echo "VITE_RAPIDAPI_KEY=tu-key" > .env
npm run dev  # reiniciar
```

### "No veo ejercicios de API"
```javascript
// Verificar estado
const estado = await ejerciciosService.verificarEstadoAPI()
console.log(estado)  // { available: true/false, error: '...' }
```

### "Rate limit exceeded"
```
Has superado tu límite diario:
- BASIC: 100 requests/día
- MEGA: 500 requests/día

Solución: Esperar 24h o upgrade a PRO
```

---

## 📚 Más Info

- 📖 [Guía completa](docs/EXERCISEDB_API.md)
- 💻 [Ejemplos de código](src/examples/ejerciciosExamples.js)
- 🎉 [Resumen integración](INTEGRATION_COMPLETE.md)
- 🔄 [Changelog](CHANGELOG.md)

---

## 🎯 Planes API

| Plan | Precio | Requests | Recomendado para |
|------|--------|----------|------------------|
| BASIC | $0/mes | 100/día | Desarrollo |
| MEGA | $0/mes | 500/día | Testing |
| PRO | $100/mes | 50,000/mes | Producción |

---

## ✨ ¡Listo!

Tu app ahora tiene:
- ✅ 15+ ejercicios locales (offline)
- ✅ +11,000 ejercicios API (online)
- ✅ Videos y GIFs en tiempo real
- ✅ Búsqueda inteligente

**¡A entrenar! 💪**
