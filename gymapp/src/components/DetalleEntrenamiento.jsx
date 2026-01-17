import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { storageService } from '../services/storage'
import ConfirmDialog from './ConfirmDialog'
import './DetalleEntrenamiento.css'

export default function DetalleEntrenamiento() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entrenamiento, setEntrenamiento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await storageService.obtenerEntrenamiento(parseInt(id))
        if (!data) {
          navigate('/historial')
          return
        }
        setEntrenamiento(data)
      } catch (error) {
        console.error('Error al cargar entrenamiento:', error)
        navigate('/historial')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [id, navigate])

  const handleEliminar = async () => {
    try {
      await storageService.eliminarEntrenamiento(parseInt(id))
      setMostrarConfirmEliminar(false)
      navigate('/historial')
    } catch (error) {
      alert('Error al eliminar el entrenamiento')
    }
  }

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  if (!entrenamiento) {
    return null
  }

  const totalSeries = entrenamiento.ejercicios.reduce((sum, ej) => sum + ej.series.length, 0)
  const pesoTotal = entrenamiento.ejercicios.reduce((sum, ej) => 
    sum + ej.series.reduce((s, serie) => s + (serie.peso * serie.repeticiones), 0)
  , 0)

  return (
    <div className="detalle-entrenamiento">
      <div className="detalle-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Volver
        </button>
        <button onClick={() => setMostrarConfirmEliminar(true)} className="btn-icon btn-danger">
          🗑️ Eliminar
        </button>
      </div>

      <div className="fecha-principal">
        {new Date(entrenamiento.fecha).toLocaleDateString('es', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>

      <div className="stats-mini">
        <div className="stat-mini">
          <span className="stat-mini-value">{entrenamiento.ejercicios.length}</span>
          <span className="stat-mini-label">Ejercicios</span>
        </div>
        <div className="stat-mini">
          <span className="stat-mini-value">{totalSeries}</span>
          <span className="stat-mini-label">Series</span>
        </div>
        <div className="stat-mini">
          <span className="stat-mini-value">{pesoTotal.toFixed(0)}</span>
          <span className="stat-mini-label">kg Total</span>
        </div>
      </div>

      <div className="ejercicios-detalle">
        {entrenamiento.ejercicios.map((ejercicio, index) => (
          <div key={index} className="ejercicio-detalle-card">
            <h3 className="ejercicio-nombre">{ejercicio.nombre}</h3>
            <table className="series-table">
              <thead>
                <tr>
                  <th>Serie</th>
                  <th>Reps</th>
                  <th>Peso</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ejercicio.series.map((serie, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{serie.repeticiones}</td>
                    <td>{serie.peso} kg</td>
                    <td className="total">{(serie.repeticiones * serie.peso).toFixed(1)} kg</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="totals-row">
                  <td colSpan="3"><strong>Total del ejercicio</strong></td>
                  <td className="total">
                    <strong>
                      {ejercicio.series.reduce((sum, s) => sum + (s.repeticiones * s.peso), 0).toFixed(1)} kg
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={mostrarConfirmEliminar}
        onClose={() => setMostrarConfirmEliminar(false)}
        onConfirm={handleEliminar}
        title="⚠️ Eliminar Entrenamiento"
        message="¿Estás seguro de eliminar este entrenamiento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        danger={true}
      />
    </div>
  )
}
