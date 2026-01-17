import { useNavigate } from 'react-router-dom'
import { useRutinaActiva } from '../hooks/useRutinaActiva'
import { ejerciciosService } from '../services/ejercicios'
import { useState, useEffect } from 'react'
import ConfirmDialog from './ConfirmDialog'
import './Rutinas.css'

export default function Rutinas() {
  const navigate = useNavigate()
  const { rutinaActiva, loading, estadisticas, finalizarRutina } = useRutinaActiva()
  const [ejerciciosPreview, setEjerciciosPreview] = useState({})
  const [mostrarConfirmFinalizar, setMostrarConfirmFinalizar] = useState(false)

  // Cargar nombres de ejercicios para preview
  useEffect(() => {
    if (!rutinaActiva) return
    
    async function cargarPreviews() {
      const previews = {}
      
      for (let diaIndex = 0; diaIndex < rutinaActiva.dias.length; diaIndex++) {
        const dia = rutinaActiva.dias[diaIndex]
        previews[diaIndex] = []
        
        for (const ejId of dia.ejercicios.slice(0, 3)) {
          const ejercicio = await ejerciciosService.obtenerPorId(ejId)
          if (ejercicio) {
            previews[diaIndex].push(ejercicio.nombre)
          }
        }
      }
      
      setEjerciciosPreview(previews)
    }
    
    cargarPreviews()
  }, [rutinaActiva])

  const handleFinalizarRutina = async () => {
    try {
      await finalizarRutina()
      setMostrarConfirmFinalizar(false)
    } catch (error) {
      alert('Error al finalizar rutina')
    }
  }

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  if (!rutinaActiva) {
    return (
      <div className="rutinas">
        <h2>Rutinas</h2>
        <div className="empty-state">
          <p>🏋️ No tienes una rutina activa</p>
          <p>Genera una rutina personalizada para empezar</p>
          <button onClick={() => navigate('/generar-rutina')} className="btn btn-primary btn-large">
            Generar Rutina
          </button>
          <button onClick={() => navigate('/catalogo-ejercicios')} className="btn btn-secondary">
            Ver Catálogo de Ejercicios
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rutinas">
      <div className="rutina-header">
        <h2>{rutinaActiva.nombre}</h2>
        <button onClick={() => setMostrarConfirmFinalizar(true)} className="btn-icon btn-danger">
          🗑️
        </button>
      </div>

      {estadisticas && (
        <div className="progreso-card">
          <div className="progreso-header">
            <h3>Progreso</h3>
            <span className="progreso-porcentaje">{estadisticas.porcentaje}%</span>
          </div>
          <div className="progreso-bar">
            <div 
              className="progreso-fill" 
              style={{ width: `${estadisticas.porcentaje}%` }}
            />
          </div>
          <div className="progreso-stats">
            <span>{estadisticas.diasCompletados} de {estadisticas.totalDias} días completados</span>
          </div>
        </div>
      )}

      <div className="rutina-dias">
        {rutinaActiva.dias.map((dia, index) => {
          const progresoDia = rutinaActiva.progreso[index]
          const completado = progresoDia.completado

          return (
            <div 
              key={index} 
              className={`dia-item ${completado ? 'completado' : ''}`}
              onClick={() => navigate(`/rutina-dia/${index}`)}
            >
              <div className="dia-header">
                <div>
                  <h3>{dia.nombre}</h3>
                  <span className="dia-ejercicios">{dia.ejercicios.length} ejercicios</span>
                </div>
                {completado && <span className="check-icon">✓</span>}
              </div>
              
              <div className="dia-preview">
                {ejerciciosPreview[index]?.map((nombre, i) => (
                  <span key={i} className="ejercicio-tag">
                    {nombre}
                  </span>
                ))}
                {dia.ejercicios.length > 3 && (
                  <span className="ejercicio-tag">+{dia.ejercicios.length - 3} más</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="rutina-actions">
        <button onClick={() => navigate('/catalogo-ejercicios')} className="btn btn-secondary">
          📚 Ver Catálogo de Ejercicios
        </button>
      </div>

      <ConfirmDialog
        isOpen={mostrarConfirmFinalizar}
        onClose={() => setMostrarConfirmFinalizar(false)}
        onConfirm={handleFinalizarRutina}
        title="¿Finalizar rutina?"
        message="Esta rutina se marcará como completada y se moverá al historial. ¿Deseas continuar?"
        confirmText="Finalizar"
        danger={false}
      />
    </div>
  )
}
