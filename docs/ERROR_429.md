# 🚨 Solucionando Error 429 - Rate Limit Excedido

## ¿Qué significa el error 429?

El error **429 Too Many Requests** significa que has superado el límite de solicitudes permitidas en tu plan de RapidAPI.

```
Error: API Error: 429
⚠️ Rate limit excedido. Has superado el límite de requests de tu plan.
```

## 📊 Límites por Plan

| Plan | Requests | Costo |
|------|----------|-------|
| **BASIC** | 100/día | $0/mes |
| **MEGA** | 500/día | $0/mes |
| **PRO** | 50,000/mes | $100/mes |

## 🔍 ¿Por qué sucede?

Cada vez que:
- Abres el catálogo de ejercicios
- Filtras por grupo muscular
- Buscas un ejercicio
- Cambias de filtro
- Recargas la página

Se hacen peticiones a la API. Si haces muchas en poco tiempo, llegas al límite.

## ✅ Soluciones

### 1. Espera 24 horas (Plan BASIC/MEGA)
Los límites se resetean cada 24 horas. Si estás en plan gratis, simplemente espera.

### 2. Actualiza a un plan superior
Si necesitas más requests:
1. Ve a [RapidAPI Dashboard](https://rapidapi.com/developer/billing)
2. Actualiza a **MEGA** (gratis, 500/día) o **PRO** ($100/mes, 50k)

### 3. Usa el catálogo local
La app funciona perfectamente sin la API usando el catálogo local (15+ ejercicios):

```bash
# Detener el servidor
# Ctrl+C

# Comentar la API key temporalmente
# En .env:
# VITE_RAPIDAPI_KEY=tu-key-aqui

# Reiniciar
npm run dev
```

### 4. Optimiza tu uso

**Nuestra app ya implementa optimizaciones:**
- ✅ Cache de 50 minutos (reduce requests repetidos)
- ✅ Limpieza automática de cache
- ✅ Fallback a catálogo local

**Pero puedes hacer más:**
- 🔍 Limita las búsquedas (busca solo cuando necesites)
- 🚫 Evita recargar la página constantemente
- 📱 Cierra la app cuando no la uses (evita requests en background)
- 💾 Marca favoritos por ID (no por contenido)

## 🔎 Verificar tu uso

1. Ve a [RapidAPI Dashboard](https://rapidapi.com/developer/apps)
2. Selecciona tu app
3. Ve a "Analytics" o "Usage"
4. Verás cuántos requests has usado hoy

## 🛠️ Verificar el error en tu app

Abre la consola del navegador (F12) y verás:

```javascript
Error fetching from ExerciseDB API: 
⚠️ Rate limit excedido. Has superado el límite de requests de tu plan.
```

El banner amarillo también aparecerá automáticamente en la interfaz.

## 📝 Monitoreo manual

Puedes verificar tu estado desde la consola del navegador:

```javascript
// En la consola del navegador
import { ejerciciosService } from './services/ejercicios'
await ejerciciosService.verificarEstadoAPI()
```

## 🚀 Para Producción

Si planeas lanzar la app públicamente, considera:

### Opción 1: Backend Proxy
Crear un backend que:
- Maneje la API key (no expuesta en frontend)
- Implemente rate limiting propio
- Distribuya requests entre múltiples usuarios

### Opción 2: Plan PRO
- 50,000 requests/mes
- ~1,667 requests/día
- Suficiente para 50-100 usuarios activos/día

### Opción 3: Solo Catálogo Local
- La app funciona 100% sin API
- 15+ ejercicios disponibles
- Sin costos de API
- Offline-first

## 🔧 Troubleshooting

### "Sigo viendo el error después de 24 horas"
- Verifica que sea realmente 24h completas
- Chequea tu dashboard de RapidAPI
- Puede que tengas múltiples apps usando la misma key

### "El error aparece inmediatamente al abrir la app"
- Tu límite ya estaba agotado antes
- Verifica en RapidAPI Analytics cuándo se resetea
- Considera cambiar a plan MEGA

### "Quiero deshabilitar la API temporalmente"
```bash
# En .env, comenta la línea:
# VITE_RAPIDAPI_KEY=tu-key

# O bórrala temporalmente
# La app funcionará con catálogo local
```

### "¿Puedo comprar más requests sin upgrade?"
No. Los planes son fijos:
- BASIC: 100/día fijo
- MEGA: 500/día fijo
- PRO: ~1,667/día (50k/mes)

## 💡 Recomendaciones

### Para Desarrollo (tú)
- **Plan MEGA** (gratis): 500 req/día es suficiente
- Evita hacer testing excesivo
- Usa catálogo local para pruebas de UI

### Para Testing con amigos
- **Plan MEGA**: 3-5 personas testeando
- Coordina horarios para distribuir uso
- Usa catálogo local como default

### Para Producción real
- **Plan PRO**: Necesario si esperas 20+ usuarios/día
- O implementa backend proxy
- O usa solo catálogo local

## 📞 Soporte

- **RapidAPI Support**: support@rapidapi.com
- **Dashboard**: https://rapidapi.com/developer
- **Pricing**: https://rapidapi.com/ascendapi/api/exercise-db-with-videos-and-images-by-ascendapi/pricing

## ✨ Resumen

El error 429 es normal si usas mucho la API. Tu app está configurada correctamente y funciona perfectamente con catálogo local mientras esperas que se resetee el límite.

**Próximos pasos:**
1. ✅ Espera 24h para reset automático
2. ✅ O actualiza a plan MEGA (gratis, más requests)
3. ✅ O usa catálogo local temporalmente

¡La app sigue funcionando! 💪
