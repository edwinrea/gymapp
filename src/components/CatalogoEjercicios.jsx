import { useState, useEffect } from 'react'
import { ejerciciosService } from '../services/ejercicios'
import VideoPlayer from './VideoPlayer'
import './CatalogoEjercicios.css'

export default function CatalogoEjercicios() {
  const [filtro, setFiltro] = useState('todos')
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null)
  const [ejercicios, setEjercicios] = useState([])
  const [loading, setLoading] = useState(false)
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [estadoAPI, setEstadoAPI] = useState(null)
  
  const grupos = ['todos', ...ejerciciosService.obtenerGruposMusculares()]

  // Verificar estado de la API al montar
  useEffect(() => {
    ejerciciosService.verificarEstadoAPI().then(estado => {
      setEstadoAPI(estado)
      if (!estado.available && estado.error) {
        console.log('ExerciseDB API no disponible:', estado.error)
      }
    }).catch(err => {
      console.warn('No se pudo verificar estado de API:', err.message)
      setEstadoAPI({ available: false, error: err.message })
    })
  }, [])

  // Cargar ejercicios cuando cambia el filtro
  useEffect(() => {
    cargarEjercicios()
  }, [filtro])

  const cargarEjercicios = async () => {
    setLoading(true)
    try {
      let resultado
      if (filtro === 'todos') {
        // Obtener locales + intentar API
        resultado = ejerciciosService.obtenerTodos()
        // Si API disponible, agregar algunos más
        if (estadoAPI?.available) {
          try {
            const extras = await ejerciciosService.buscarEjercicios('', 20)
            const idsLocales = new Set(resultado.map(e => e.id))
            const extrasUnicos = extras.filter(e => !idsLocales.has(e.id))
            resultado = [...resultado, ...extrasUnicos]
          } catch (err) {
            console.warn('Error cargando ejercicios extras:', err)
          }
        }
      } else {
        resultado = await ejerciciosService.obtenerPorGrupo(filtro, estadoAPI?.available)
      }
      setEjercicios(resultado)
    } catch (error) {
      console.error('Error cargando ejercicios:', error)
      setEjercicios(ejerciciosService.obtenerTodos())
    } finally {
      setLoading(false)
    }
  }

  const buscarEjercicios = async (e) => {
    e.preventDefault()
    if (!terminoBusqueda.trim()) {
      cargarEjercicios()
      return
    }

    setLoading(true)
    try {
      const resultados = await ejerciciosService.buscarEjercicios(terminoBusqueda)
      setEjercicios(resultados)
    } catch (error) {
      console.error('Error buscando ejercicios:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="catalogo-ejercicios">
      <h2>Catálogo de Ejercicios</h2>

      {estadoAPI && !estadoAPI.available && (
        <div className={estadoAPI.error && estadoAPI.error.includes('429') ? 'error-banner' : 'info-banner'}>
          {estadoAPI.error && estadoAPI.error.includes('429') ? '⚠️' : 'ℹ️'} 
          {estadoAPI.error || `Mostrando catálogo local (${ejerciciosService.obtenerTodos().length} ejercicios). Para acceder a +11,000 ejercicios con videos, configura tu API key.`}
        </div>
      )}

      {estadoAPI?.available && (
        <div className="success-banner">
          ✅ ExerciseDB API conectada - Acceso a +11,000 ejercicios con videos
        </div>
      )}

      <form className="search-form" onSubmit={buscarEjercicios}>
        <input
          type="text"
          placeholder="Buscar ejercicios..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn btn-primary">Buscar</button>
        {terminoBusqueda && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              setTerminoBusqueda('')
              cargarEjercicios()
            }}
          >
            Limpiar
          </button>
        )}
      </form>

      <div className="filtros-scroll">
        {grupos.map(grupo => (
          <button
            key={grupo}
            className={`filtro-btn ${filtro === grupo ? 'active' : ''}`}
            onClick={() => setFiltro(grupo)}
          >
            {grupo}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading">Cargando ejercicios...</div>
      )}

      <div className="ejercicios-grid">
        {ejercicios.map(ejercicio => (
          <div 
            key={ejercicio.id}
            className="ejercicio-catalogo-card"
            onClick={() => setEjercicioSeleccionado(ejercicio)}
          >
            {(ejercicio.video || ejercicio.gif || ejercicio.thumbnail) && (
              <div className="ejercicio-catalogo-imagen">
                <VideoPlayer
                  src={ejercicio.video || ejercicio.gif}
                  thumbnail={ejercicio.thumbnail}
                  alt={ejercicio.nombre}
                />
              </div>
            )}
            <div className="ejercicio-catalogo-info">
              <h3>{ejercicio.nombre}</h3>
              <div className="ejercicio-catalogo-tags">
                <span className="mini-tag">{ejercicio.grupoMuscular}</span>
                <span className={`mini-tag mini-tag-${ejercicio.dificultad}`}>
                  {ejercicio.dificultad}
                </span>
                {ejercicio.apiSource && (
                  <span className="mini-tag api-badge">API</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {ejercicioSeleccionado && (
        <div className="modal-overlay" onClick={() => setEjercicioSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setEjercicioSeleccionado(null)}
            >
              ✕
            </button>
            
            <h2>{ejercicioSeleccionado.nombre}</h2>
            
            {ejercicioSeleccionado.video && (
              <div className="modal-video-container">
                <VideoPlayer
                  src={ejercicioSeleccionado.video}
                  thumbnail={ejercicioSeleccionado.thumbnail}
                  alt={ejercicioSeleccionado.nombre}
                />
              </div>
            )}

            {ejercicioSeleccionado.gif && !ejercicioSeleccionado.video && (
              <div className="modal-video-container">
                <img src={ejercicioSeleccionado.gif} alt={ejercicioSeleccionado.nombre} />
              </div>
            )}

            {ejercicioSeleccionado.imagenes && ejercicioSeleccionado.imagenes.length > 0 && (
              <div className="modal-images">
                {ejercicioSeleccionado.imagenes.map((img, i) => (
                  <img key={i} src={img} alt={`${ejercicioSeleccionado.nombre} ${i + 1}`} />
                ))}
              </div>
            )}

            <div className="modal-section">
              <h3>Descripción</h3>
              <p>{ejercicioSeleccionado.descripcion}</p>
            </div>

            <div className="modal-section">
              <h3>Información</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Grupo Principal</span>
                  <span className="info-value">{ejercicioSeleccionado.grupoMuscular}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Equipamiento</span>
                  <span className="info-value">{ejercicioSeleccionado.equipamiento}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Dificultad</span>
                  <span className="info-value">{ejercicioSeleccionado.dificultad}</span>
                </div>
              </div>
            </div>

            {ejercicioSeleccionado.gruposSecundarios.length > 0 && (
              <div className="modal-section">
                <h3>Grupos Secundarios</h3>
                <div className="modal-tags">
                  {ejercicioSeleccionado.gruposSecundarios.map((g, i) => (
                    <span key={i} className="tag">{g}</span>
                  ))}
                </div>
              </div>
            )}

            {ejercicioSeleccionado.instrucciones && (
              <div className="modal-section">
                <h3>Cómo Realizar</h3>
                <ol className="instrucciones-lista">
                  {ejercicioSeleccionado.instrucciones.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="modal-section">
              <h3>Recomendación</h3>
              <p>
                <strong>Series:</strong> {ejercicioSeleccionado.seriesRecomendadas.min}-{ejercicioSeleccionado.seriesRecomendadas.max}
                <br />
                <strong>Repeticiones:</strong> {ejercicioSeleccionado.repeticionesRecomendadas.min}-{ejercicioSeleccionado.repeticionesRecomendadas.max}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
