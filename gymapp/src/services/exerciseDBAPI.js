/**
 * Servicio para integración con ExerciseDB API (RapidAPI)
 * 
 * IMPORTANTE: Esta API tiene restricciones estrictas:
 * - NO se puede almacenar contenido localmente
 * - Solo caché temporal (< 1 hora)
 * - Requiere suscripción activa
 * - Acceso en tiempo real únicamente
 * 
 * Configuración:
 * 1. Registrarse en https://rapidapi.com/ascendapi/api/exercise-db-with-videos-and-images-by-ascendapi
 * 2. Obtener API Key
 * 3. Configurar en .env: VITE_RAPIDAPI_KEY=tu-api-key
 */

const RAPIDAPI_HOST = 'exercise-db-with-videos-and-images-by-ascendapi.p.rapidapi.com'
const BASE_URL = `https://${RAPIDAPI_HOST}/api/v1`

// Cache temporal (máximo 1 hora según términos de la API)
const cache = new Map()
const CACHE_DURATION = 50 * 60 * 1000 // 50 minutos para estar seguros

/**
 * Obtiene la API key del entorno
 */
const getApiKey = () => {
  const key = import.meta.env.VITE_RAPIDAPI_KEY
  if (!key) {
    console.warn('⚠️ VITE_RAPIDAPI_KEY no configurada. Crea un archivo .env con tu API key de RapidAPI')
  }
  return key
}

/**
 * Verifica si la API está configurada
 */
export const isAPIConfigured = () => {
  return !!getApiKey()
}

/**
 * Headers comunes para todas las peticiones
 */
const getHeaders = () => ({
  'X-RapidAPI-Key': getApiKey(),
  'X-RapidAPI-Host': RAPIDAPI_HOST
})

/**
 * Wrapper para fetch con cache temporal
 */
const fetchWithCache = async (url, options = {}) => {
  // Verificar cache
  const cached = cache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers
      }
    })

    if (!response.ok) {
      // Manejar errores específicos
      if (response.status === 429) {
        throw new Error('Rate limit excedido. Has superado el límite de requests de tu plan. Espera un momento o actualiza tu suscripción.')
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error('API Key inválida o sin permisos. Verifica tu configuración en .env')
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Guardar en cache temporal
    cache.set(url, {
      data,
      timestamp: Date.now()
    })

    return data
  } catch (error) {
    console.error('Error fetching from ExerciseDB API:', error)
    throw error
  }
}

/**
 * Limpiar cache expirado (llamar periódicamente)
 */
export const clearExpiredCache = () => {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp >= CACHE_DURATION) {
      cache.delete(key)
    }
  }
}

// Limpiar cache cada 10 minutos
setInterval(clearExpiredCache, 10 * 60 * 1000)

/**
 * Verifica el estado de la API
 */
export const checkAPIStatus = async () => {
  if (!isAPIConfigured()) {
    return { available: false, error: 'API key no configurada' }
  }

  try {
    // Hacer una petición mínima para verificar conectividad
    // Usar el endpoint de ejercicios con límite 1
    const url = `${BASE_URL}/exercises?limit=1`
    await fetchWithCache(url)
    return { available: true }
  } catch (error) {
    return { available: false, error: error.message }
  }
}

/**
 * Buscar ejercicios por término de búsqueda
 * @param {string} query - Término de búsqueda
 * @param {number} limit - Número máximo de resultados
 * @param {number} offset - Offset para paginación
 */
export const searchExercises = async (query, limit = 20, offset = 0) => {
  if (!isAPIConfigured()) {
    throw new Error('API key no configurada')
  }

  const url = `${BASE_URL}/exercises/search?search=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
  return await fetchWithCache(url)
}

/**
 * Obtener lista de ejercicios con filtros opcionales
 * @param {Object} params - Parámetros de filtrado
 * @param {number} params.limit - Número de resultados (default: 20)
 * @param {number} params.offset - Offset para paginación (default: 0)
 */
export const getExercises = async ({ limit = 20, offset = 0 } = {}) => {
  if (!isAPIConfigured()) {
    throw new Error('API key no configurada')
  }

  const url = `${BASE_URL}/exercises?limit=${limit}&offset=${offset}`
  return await fetchWithCache(url)
}

/**
 * Obtener ejercicio por ID
 * @param {string} id - ID del ejercicio
 */
export const getExerciseById = async (id) => {
  if (!isAPIConfigured()) {
    throw new Error('API key no configurada')
  }

  const url = `${BASE_URL}/exercises/${id}`
  return await fetchWithCache(url)
}

/**
 * Mapeo de grupos musculares (español -> inglés API)
 */
const muscleGroupMapping = {
  'pecho': 'chest',
  'espalda': 'back',
  'piernas': 'legs',
  'hombros': 'shoulders',
  'biceps': 'biceps',
  'triceps': 'triceps',
  'core': 'core',
  'abdominales': 'abs',
  'gluteos': 'glutes',
  'pantorrillas': 'calves',
  'cuadriceps': 'quadriceps',
  'isquiotibiales': 'hamstrings'
}

/**
 * Buscar ejercicios por grupo muscular
 * @param {string} grupoMuscular - Grupo muscular en español
 * @param {number} limit - Número de resultados
 */
export const buscarPorGrupoMuscular = async (grupoMuscular, limit = 20) => {
  const muscleInEnglish = muscleGroupMapping[grupoMuscular.toLowerCase()] || grupoMuscular
  const results = await searchExercises(muscleInEnglish, limit)
  
  // Log temporal para debug
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Respuesta de buscarPorGrupoMuscular:', results)
  }
  
  // La API devuelve un objeto con { exercises: [...] } o { data: [...] }
  const exercisesArray = results?.exercises || results?.data || results
  
  if (!Array.isArray(exercisesArray)) {
    console.warn('⚠️ La API no devolvió un array:', exercisesArray)
    return []
  }
  
  return exercisesArray.map(normalizarEjercicio).filter(Boolean)
}

/**
 * Normalizar datos de la API al formato interno de la app
 * @param {Object} exerciseData - Datos crudos de la API
 */
export const normalizarEjercicio = (exerciseData) => {
  if (!exerciseData) return null

  // Log temporal para debug - ver estructura real de la API
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Estructura de ejercicio desde API:', exerciseData)
  }

  // Mapeo inverso para grupos musculares
  const inverseMuscleMap = Object.fromEntries(
    Object.entries(muscleGroupMapping).map(([es, en]) => [en, es])
  )

  // Intentar múltiples nombres de campos que la API podría usar
  const normalized = {
    id: exerciseData.id || exerciseData._id,
    nombre: exerciseData.name || exerciseData.title || 'Sin nombre',
    grupoMuscular: inverseMuscleMap[exerciseData.targetMuscle || exerciseData.target] || exerciseData.targetMuscle || exerciseData.target || 'general',
    gruposSecundarios: (exerciseData.secondaryMuscles || exerciseData.secondary || []).map(m => inverseMuscleMap[m] || m),
    dificultad: exerciseData.difficulty || exerciseData.level || 'intermedio',
    equipamiento: exerciseData.equipment || exerciseData.gear || 'propio-peso',
    descripcion: exerciseData.description || exerciseData.desc || '',
    // URLs de medios - intentar múltiples nombres
    video: exerciseData.videoUrl || exerciseData.video_url || exerciseData.video || null,
    videoSecundario: exerciseData.videoUrlSecondary || exerciseData.video_url_secondary || null,
    gif: exerciseData.gifUrl || exerciseData.gif_url || exerciseData.gif || null,
    thumbnail: exerciseData.thumbnailUrl || exerciseData.thumbnail_url || exerciseData.thumbnail || exerciseData.image || null,
    imagenes: exerciseData.images || exerciseData.imgs || [],
    instrucciones: exerciseData.instructions || exerciseData.steps || [],
    seriesRecomendadas: { min: 3, max: 5 },
    repeticionesRecomendadas: { min: 8, max: 12 },
    // Metadata adicional
    apiSource: 'exercisedb',
    fetchedAt: new Date().toISOString()
  }

  // Log del resultado normalizado
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Ejercicio normalizado:', normalized)
  }

  return normalized
}

/**
 * Buscar ejercicios y normalizar resultados
 * @param {string} query - Término de búsqueda
 * @param {number} limit - Número de resultados
 */
export const buscarYNormalizar = async (query, limit = 20) => {
  try {
    const results = await searchExercises(query, limit)
    
    // Log temporal para debug
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Respuesta de búsqueda:', results)
    }
    
    // La API puede devolver diferentes estructuras
    const exercisesArray = results?.exercises || results?.data || results
    
    if (!Array.isArray(exercisesArray)) {
      console.warn('⚠️ La API no devolvió un array:', exercisesArray)
      return []
    }

    return exercisesArray.map(normalizarEjercicio).filter(Boolean)
  } catch (error) {
    console.error('Error buscando ejercicios:', error)
    return []
  }
}

/**
 * Obtener sugerencias de ejercicios similares
 * @param {string} ejercicioId - ID del ejercicio actual
 * @param {number} limit - Número de sugerencias
 */
export const obtenerEjerciciosSimilares = async (ejercicioId, limit = 5) => {
  try {
    // Primero obtener el ejercicio actual
    const ejercicio = await getExerciseById(ejercicioId)
    
    if (!ejercicio || !ejercicio.targetMuscle) {
      return []
    }

    // Buscar ejercicios del mismo grupo muscular
    const similares = await searchExercises(ejercicio.targetMuscle, limit + 1)
    
    if (!similares || !similares.exercises) {
      return []
    }

    // Filtrar el ejercicio actual y normalizar
    return similares.exercises
      .filter(ex => ex.id !== ejercicioId)
      .slice(0, limit)
      .map(normalizarEjercicio)
      .filter(Boolean)
  } catch (error) {
    console.error('Error obteniendo ejercicios similares:', error)
    return []
  }
}

export default {
  isAPIConfigured,
  checkAPIStatus,
  searchExercises,
  getExercises,
  getExerciseById,
  buscarPorGrupoMuscular,
  normalizarEjercicio,
  buscarYNormalizar,
  obtenerEjerciciosSimilares,
  clearExpiredCache
}
