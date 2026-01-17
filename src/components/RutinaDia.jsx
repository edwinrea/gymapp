import { useParams, useNavigate } from 'react-router-dom'
import { useRutinaActiva } from '../hooks/useRutinaActiva'
import { useEntrenamientos } from '../hooks/useEntrenamientos'
import { ejerciciosService } from '../services/ejercicios'
import { useState, useEffect } from 'react'
import VideoPlayer from './VideoPlayer'
import ConfirmDialog from './ConfirmDialog'
import './RutinaDia.css'

export default function RutinaDia() {
  const { indiceDia } = useParams()
  const navigate = useNavigate()
  const { rutinaActiva, marcarDiaCompletado } = useRutinaActiva()
  const { agregarEntrenamiento, entrenamientos } = useEntrenamientos()
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null)
  const [ejerciciosCargados, setEjerciciosCargados] = useState([])
  const [loading, setLoading] = useState(true)
  const [seriesPrecargadas, setSeriesPrecargadas] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [seriesGuardadas, setSeriesGuardadas] = useState(null)
  const [mostrarConfirmCompletar, setMostrarConfirmCompletar] = useState(false)

  // Cargar ejercicios al montar
  useEffect(() => {
    if (!rutinaActiva) return
    
    const dia = rutinaActiva.dias[parseInt(indiceDia)]
    console.log('🔍 Cargando día:', dia)
    console.log('🔍 IDs de ejercicios:', dia.ejercicios)
    
    async function cargarEjercicios() {
      setLoading(true)
      const ejercicios = []
      
      for (const ejId of dia.ejercicios) {
        console.log('🔍 Buscando ejercicio:', ejId)
        const ejercicio = await ejerciciosService.obtenerPorId(ejId)
        console.log('✅ Ejercicio encontrado:', ejercicio)
        
        if (ejercicio) {
          ejercicios.push(ejercicio)
        } else {
          // Fallback si no encuentra el ejercicio
          console.warn('⚠️ Ejercicio no encontrado, usando fallback para:', ejId)
          ejercicios.push({
            id: ejId,
            nombre: ejId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            grupoMuscular: 'general',
            equipamiento: 'general',
            dificultad: 'intermedio',
            descripcion: 'Ejercicio del catálogo',
            video: null,
            thumbnail: null
          })
        }
      }
      
      console.log('✅ Ejercicios cargados:', ejercicios)
      setEjerciciosCargados(ejercicios)
      setLoading(false)
    }

    cargarEjercicios()
  }, [rutinaActiva, indiceDia])

  if (!rutinaActiva) {
    navigate('/rutinas')
    return null
  }

  const dia = rutinaActiva.dias[parseInt(indiceDia)]
  const progresoDia = rutinaActiva.progreso[parseInt(indiceDia)]

  const handleCompletarDia = async () => {
    try {
      // En una implementación real, aquí se crearía un entrenamiento
      await marcarDiaCompletado(parseInt(indiceDia), Date.now())
      setMostrarConfirmCompletar(false)
      navigate('/rutinas')
    } catch (error) {
      alert('Error al completar el día')
    }
  }

  const handleToggleSerie = (index) => {
    setSeriesPrecargadas(prev => prev.map((serie, i) => 
      i === index ? { ...serie, completada: !serie.completada } : serie
    ))
  }

  const handleCambioPeso = (index, peso) => {
    setSeriesPrecargadas(prev => prev.map((serie, i) => 
      i === index ? { ...serie, peso: peso } : serie
    ))
  }

  const handleCambioReps = (index, reps) => {
    setSeriesPrecargadas(prev => prev.map((serie, i) => 
      i === index ? { ...serie, repeticiones: reps } : serie
    ))
  }

  const handleEliminarSerie = (index) => {
    setSeriesPrecargadas(prev => prev.filter((_, i) => i !== index))
  }

  const handleGuardarEntrenamiento = async () => {
    const seriesCompletadas = seriesPrecargadas.filter(s => s.completada)
    
    if (seriesCompletadas.length === 0) {
      alert('Marca al menos una serie como completada')
      return
    }

    try {
      setGuardando(true)
      
      if (seriesGuardadas) {
        // Actualizar entrenamiento existente
        const entrenamientoActualizado = {
          ...seriesGuardadas,
          ejercicios: seriesGuardadas.ejercicios.map(ej => 
            ej.nombre === ejercicioSeleccionado.nombre
              ? {
                  nombre: ejercicioSeleccionado.nombre,
                  series: seriesCompletadas.map(s => ({
                    repeticiones: s.repeticiones,
                    peso: s.peso
                  }))
                }
              : ej
          )
        }
        await agregarEntrenamiento(entrenamientoActualizado)
        alert('✅ Entrenamiento actualizado')
      } else {
        // Crear nuevo entrenamiento
        await agregarEntrenamiento({
          ejercicios: [{
            nombre: ejercicioSeleccionado.nombre,
            series: seriesCompletadas.map(s => ({
              repeticiones: s.repeticiones,
              peso: s.peso
            }))
          }],
          fecha: new Date().toISOString()
        })
        alert('✅ Entrenamiento guardado')
      }
      
      setSeriesPrecargadas([])
      setEjercicioSeleccionado(null)
      setSeriesGuardadas(null)
    } catch (error) {
      alert('Error al guardar: ' + error.message)
    } finally {
      setGuardando(false)
    }
  }

  const handleCerrarModal = () => {
    setEjercicioSeleccionado(null)
    setSeriesPrecargadas([])
    setSeriesGuardadas(null)
  }

  const handleAbrirEjercicio = (ejercicio, series, reps) => {
    setEjercicioSeleccionado({ ...ejercicio, seriesRecomendadasDia: series, repsRecomendadasDia: reps })
    
    // Buscar entrenamientos previos de hoy para este ejercicio
    const hoy = new Date().toISOString().split('T')[0]
    const entrenamientoHoy = entrenamientos.find(e => {
      const fechaEntrenamiento = new Date(e.fecha).toISOString().split('T')[0]
      return fechaEntrenamiento === hoy && 
             e.ejercicios.some(ej => ej.nombre === ejercicio.nombre)
    })

    let seriesIniciales = []
    
    if (entrenamientoHoy) {
      // Cargar series guardadas
      const ejercicioGuardado = entrenamientoHoy.ejercicios.find(ej => ej.nombre === ejercicio.nombre)
      seriesIniciales = ejercicioGuardado.series.map(s => ({
        repeticiones: s.repeticiones,
        peso: s.peso || 0,
        completada: true
      }))
      setSeriesGuardadas(entrenamientoHoy)
    } else {
      // Pre-cargar series recomendadas vacías
      for (let i = 0; i < series; i++) {
        seriesIniciales.push({
          repeticiones: reps,
          peso: 0,
          completada: false
        })
      }
    }
    
    setSeriesPrecargadas(seriesIniciales)
  }

  if (loading) {
    return (
      <div className="rutina-dia">
        <button onClick={() => navigate('/rutinas')} className="btn-back">
          ← Volver
        </button>
        <div className="loading">Cargando ejercicios...</div>
      </div>
    )
  }

  return (
    <div className="rutina-dia">
      <button onClick={() => navigate('/rutinas')} className="btn-back">
        ← Volver
      </button>

      <div className="dia-titulo">
        <h2>{dia.nombre}</h2>
        {progresoDia.completado && (
          <span className="badge-completado">✓ Completado</span>
        )}
      </div>

      <div className="ejercicios-resumen">
        <p className="resumen-text">
          📋 {ejerciciosCargados.length} ejercicios • 
          💪 {dia.series.reduce((a, b) => a + b, 0)} series totales
        </p>
      </div>

      <div className="dia-ejercicios-lista">
        {ejerciciosCargados.map((ejercicio, index) => {
          const series = dia.series[index]
          const reps = dia.reps[index]
          
          // Verificar si ya está registrado hoy
          const hoy = new Date().toISOString().split('T')[0]
          const yaRegistrado = entrenamientos.some(e => {
            const fechaEntrenamiento = new Date(e.fecha).toISOString().split('T')[0]
            return fechaEntrenamiento === hoy && 
                   e.ejercicios.some(ej => ej.nombre === ejercicio.nombre)
          })

          return (
            <div 
              key={index} 
              className="ejercicio-card-grande"
              onClick={() => handleAbrirEjercicio(ejercicio, series, reps)}
            >
              <div className="ejercicio-numero">#{index + 1}</div>
              {yaRegistrado && (
                <span className="badge-registrado">✓</span>
              )}
              
              {(ejercicio.video || ejercicio.gif || ejercicio.thumbnail) && (
                <div className="ejercicio-imagen-container">
                  <VideoPlayer
                    src={ejercicio.video || ejercicio.gif}
                    thumbnail={ejercicio.thumbnail}
                    alt={ejercicio.nombre}
                  />
                </div>
              )}
              
              <div className="ejercicio-info">
                <h3>{ejercicio.nombre}</h3>
                
                <div className="ejercicio-objetivo-destacado">
                  <span className="series-badge">{series} series</span>
                  <span className="reps-badge">{reps} reps</span>
                </div>
                
                <div className="ejercicio-tags">
                  <span className="tag tag-grupo">{ejercicio.grupoMuscular}</span>
                  <span className="tag tag-equip">{ejercicio.equipamiento}</span>
                  <span className={`tag tag-${ejercicio.dificultad}`}>
                    {ejercicio.dificultad}
                  </span>
                </div>
                
                {ejercicio.descripcion && (
                  <p className="ejercicio-desc">{ejercicio.descripcion}</p>
                )}
                
                <p className="tap-hint">👆 Toca para ver detalles</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Botón floating - solo si no está completado */}
      {!progresoDia.completado && (
        <button 
          onClick={() => setMostrarConfirmCompletar(true)} 
          className="fab-primary"
          title="Marcar día como completado"
        >
          <span className="fab-icon">✓</span>
        </button>
      )}

      {ejercicioSeleccionado && (
        <div className="modal-overlay" onClick={handleCerrarModal}>
          <div className="modal-content modal-ejercicio" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={handleCerrarModal}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <h2>{ejercicioSeleccionado.nombre}</h2>
              <div className="modal-tags-header">
                <span className="tag tag-grupo">{ejercicioSeleccionado.grupoMuscular}</span>
                <span className={`tag tag-${ejercicioSeleccionado.dificultad}`}>
                  {ejercicioSeleccionado.dificultad}
                </span>
              </div>
            </div>
            
            {(ejercicioSeleccionado.video || ejercicioSeleccionado.gif) && (
              <div className="modal-video-destacado">
                <VideoPlayer
                  src={ejercicioSeleccionado.video || ejercicioSeleccionado.gif}
                  thumbnail={ejercicioSeleccionado.thumbnail}
                  alt={ejercicioSeleccionado.nombre}
                />
              </div>
            )}

            {ejercicioSeleccionado.descripcion && (
              <div className="modal-section">
                <p className="ejercicio-descripcion-modal">{ejercicioSeleccionado.descripcion}</p>
              </div>
            )}

            {ejercicioSeleccionado.instrucciones && ejercicioSeleccionado.instrucciones.length > 0 && (
              <div className="modal-section">
                <h3>📋 Cómo hacerlo</h3>
                <ol className="instrucciones-lista">
                  {ejercicioSeleccionado.instrucciones.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="modal-section modal-registro">
              <div className="registro-header-title">
                <h3>💪 Registrar Entrenamiento</h3>
                {seriesGuardadas && (
                  <span className="badge-guardado">✓ Ya registrado hoy</span>
                )}
              </div>
              <p className="registro-instruccion">
                {seriesGuardadas 
                  ? 'Estos son los datos que registraste. Puedes modificarlos si quieres.'
                  : 'Marca cada serie al completarla y agrega el peso usado'
                }
              </p>
              
              <div className="series-checklist">
                {seriesPrecargadas.map((serie, i) => (
                  <div key={i} className={`serie-item ${serie.completada ? 'completada' : ''}`}>
                    <div className="serie-checkbox">
                      <input
                        type="checkbox"
                        id={`serie-${i}`}
                        checked={serie.completada}
                        onChange={() => handleToggleSerie(i)}
                      />
                      <label htmlFor={`serie-${i}`} className="serie-label">
                        <span className="serie-num">Serie {i + 1}</span>
                      </label>
                    </div>
                    <div className="serie-inputs">
                      <div className="input-group">
                        <input
                          type="number"
                          min="1"
                          placeholder="Reps"
                          value={serie.repeticiones || ''}
                          onChange={(e) => handleCambioReps(i, e.target.value ? parseInt(e.target.value) : 0)}
                          className="input-reps"
                        />
                        <span className="input-label">reps</span>
                      </div>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.5"
                          placeholder="Peso"
                          value={serie.peso || ''}
                          onChange={(e) => handleCambioPeso(i, e.target.value ? parseFloat(e.target.value) : 0)}
                          className="input-peso"
                        />
                        <span className="input-label">kg</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEliminarSerie(i)}
                      className="btn-eliminar-serie"
                      title="Eliminar serie"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="registro-resumen">
                <span className="resumen-text">
                  {seriesPrecargadas.filter(s => s.completada).length} / {seriesPrecargadas.length} series completadas
                </span>
              </div>

              <button 
                onClick={handleGuardarEntrenamiento}
                className="btn btn-primary btn-large"
                disabled={guardando || seriesPrecargadas.filter(s => s.completada).length === 0}
              >
                {guardando ? '⏳ Guardando...' : '✅ Guardar Entrenamiento'}
              </button>
            </div>

            {ejercicioSeleccionado.gruposSecundarios && ejercicioSeleccionado.gruposSecundarios.length > 0 && (
              <div className="modal-section">
                <h3>🎯 Músculos trabajados</h3>
                <div className="modal-tags">
                  <span className="tag">Principal: {ejercicioSeleccionado.grupoMuscular}</span>
                  {ejercicioSeleccionado.gruposSecundarios.map((g, i) => (
                    <span key={i} className="tag tag-secundario">Secundario: {g}</span>
                  ))}
                </div>
              </div>
            )}

            {(ejercicioSeleccionado.seriesRecomendadas || ejercicioSeleccionado.repeticionesRecomendadas) && (
              <div className="modal-section">
                <h3>💡 Recomendación</h3>
                <p className="recomendacion-text">
                  {ejercicioSeleccionado.seriesRecomendadas && (
                    <>Series: {ejercicioSeleccionado.seriesRecomendadas.min}-{ejercicioSeleccionado.seriesRecomendadas.max}</>
                  )}
                  {ejercicioSeleccionado.seriesRecomendadas && ejercicioSeleccionado.repeticionesRecomendadas && ' | '}
                  {ejercicioSeleccionado.repeticionesRecomendadas && (
                    <>Reps: {ejercicioSeleccionado.repeticionesRecomendadas.min}-{ejercicioSeleccionado.repeticionesRecomendadas.max}</>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={mostrarConfirmCompletar}
        onClose={() => setMostrarConfirmCompletar(false)}
        onConfirm={handleCompletarDia}
        title="¿Completar día?"
        message="Este día se marcará como completado en tu rutina. ¿Deseas continuar?"
        confirmText="Marcar Completado"
        danger={false}
      />
    </div>
  )
}
