/**
 * Ejemplos de Uso - ExerciseDB API Integration
 * 
 * Este archivo demuestra cómo usar el servicio de ejercicios
 * con la integración híbrida local + API
 */

import { ejerciciosService } from '../services/ejercicios'

// ==============================================
// EJEMPLO 1: Búsqueda básica de ejercicios
// ==============================================

async function ejemploBusqueda() {
  console.log('=== Búsqueda de ejercicios ===')
  
  // Buscar "press" en catálogo local + API
  const resultados = await ejerciciosService.buscarEjercicios('press', 10)
  
  resultados.forEach(ej => {
    console.log(`
      ${ej.nombre}
      - Grupo: ${ej.grupoMuscular}
      - Fuente: ${ej.apiSource || 'local'}
      - Video: ${ej.video ? '✅' : '❌'}
    `)
  })
}

// ==============================================
// EJEMPLO 2: Obtener ejercicios por grupo muscular
// ==============================================

async function ejemploGrupoMuscular() {
  console.log('=== Ejercicios de pecho ===')
  
  // incluirAPI=true para combinar local + API
  const ejerciciosPecho = await ejerciciosService.obtenerPorGrupo('pecho', true)
  
  console.log(`Total encontrados: ${ejerciciosPecho.length}`)
  console.log('Ejercicios:')
  ejerciciosPecho.forEach(ej => {
    console.log(`- ${ej.nombre} (${ej.dificultad})`)
  })
}

// ==============================================
// EJEMPLO 3: Obtener detalles de un ejercicio
// ==============================================

async function ejemploDetalleEjercicio() {
  console.log('=== Detalle de ejercicio ===')
  
  // Busca primero en local, luego en API si no lo encuentra
  const ejercicio = await ejerciciosService.obtenerPorId('press-banca')
  
  if (ejercicio) {
    console.log(`
      Nombre: ${ejercicio.nombre}
      Descripción: ${ejercicio.descripcion}
      Grupos musculares: ${ejercicio.grupoMuscular} + [${ejercicio.gruposSecundarios.join(', ')}]
      Equipamiento: ${ejercicio.equipamiento}
      Series recomendadas: ${ejercicio.seriesRecomendadas.min}-${ejercicio.seriesRecomendadas.max}
      Reps recomendadas: ${ejercicio.repeticionesRecomendadas.min}-${ejercicio.repeticionesRecomendadas.max}
      
      Instrucciones:
      ${ejercicio.instrucciones.map((inst, i) => `${i + 1}. ${inst}`).join('\n      ')}
      
      Multimedia:
      - Video: ${ejercicio.video || 'No disponible'}
      - GIF: ${ejercicio.gif || 'No disponible'}
      - Thumbnail: ${ejercicio.thumbnail || 'No disponible'}
    `)
  }
}

// ==============================================
// EJEMPLO 4: Verificar estado de la API
// ==============================================

async function ejemploEstadoAPI() {
  console.log('=== Estado de la API ===')
  
  const estado = await ejerciciosService.verificarEstadoAPI()
  
  if (estado.available) {
    console.log('✅ API conectada y funcionando')
    console.log(`Requests disponibles: ${estado.remaining || 'N/A'}`)
  } else {
    console.log('❌ API no disponible')
    console.log(`Razón: ${estado.error}`)
    console.log('💡 La app funciona con catálogo local')
  }
}

// ==============================================
// EJEMPLO 5: Obtener ejercicios similares
// ==============================================

async function ejemploSimilares() {
  console.log('=== Ejercicios similares ===')
  
  // Solo funciona si la API está configurada
  const similares = await ejerciciosService.obtenerSimilares('press-banca', 5)
  
  if (similares.length > 0) {
    console.log('Ejercicios similares al Press de Banca:')
    similares.forEach(ej => {
      console.log(`- ${ej.nombre} (${ej.grupoMuscular})`)
    })
  } else {
    console.log('No se encontraron similares (API no configurada)')
  }
}

// ==============================================
// EJEMPLO 6: Uso en componente React
// ==============================================

import { useState, useEffect } from 'react'

function ComponenteEjemplo() {
  const [ejercicios, setEjercicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiDisponible, setApiDisponible] = useState(false)

  useEffect(() => {
    async function cargarDatos() {
      // Verificar API
      const estado = await ejerciciosService.verificarEstadoAPI()
      setApiDisponible(estado.available)

      // Cargar ejercicios de pecho
      const pecho = await ejerciciosService.obtenerPorGrupo('pecho', estado.available)
      setEjercicios(pecho)
      setLoading(false)
    }

    cargarDatos()
  }, [])

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      {!apiDisponible && (
        <p>💡 Usando catálogo local. Configura API key para +11,000 ejercicios.</p>
      )}
      
      <ul>
        {ejercicios.map(ej => (
          <li key={ej.id}>
            {ej.nombre}
            {ej.video && <span> 🎬</span>}
            {ej.apiSource && <span className="badge">API</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ==============================================
// EJEMPLO 7: Búsqueda con autocomplete
// ==============================================

function BuscadorEjercicios() {
  const [termino, setTermino] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)

  const buscar = async (texto) => {
    if (!texto.trim()) {
      setResultados([])
      return
    }

    setBuscando(true)
    try {
      const results = await ejerciciosService.buscarEjercicios(texto, 10)
      setResultados(results)
    } catch (error) {
      console.error('Error en búsqueda:', error)
    } finally {
      setBuscando(false)
    }
  }

  // Debounce para no hacer requests en cada tecla
  useEffect(() => {
    const timer = setTimeout(() => {
      buscar(termino)
    }, 300)

    return () => clearTimeout(timer)
  }, [termino])

  return (
    <div>
      <input
        type="text"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        placeholder="Buscar ejercicios..."
      />
      
      {buscando && <p>Buscando...</p>}
      
      <ul>
        {resultados.map(ej => (
          <li key={ej.id}>
            <img src={ej.thumbnail} alt={ej.nombre} width="50" />
            <span>{ej.nombre}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ==============================================
// EJECUTAR EJEMPLOS (solo en modo desarrollo)
// ==============================================

if (import.meta.env.DEV) {
  // Descomentar para probar
  // ejemploEstadoAPI()
  // ejemploBusqueda()
  // ejemploGrupoMuscular()
  // ejemploDetalleEjercicio()
  // ejemploSimilares()
}

export {
  ejemploBusqueda,
  ejemploGrupoMuscular,
  ejemploDetalleEjercicio,
  ejemploEstadoAPI,
  ejemploSimilares,
  ComponenteEjemplo,
  BuscadorEjercicios
}
