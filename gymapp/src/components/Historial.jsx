import { useEntrenamientos } from '../hooks/useEntrenamientos'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import './Historial.css'

export default function Historial() {
  const { entrenamientos, loading, eliminarEntrenamiento } = useEntrenamientos()
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState(false)
  const [entrenamientoAEliminar, setEntrenamientoAEliminar] = useState(null)

  const handleEliminar = async (id, e) => {
    e.preventDefault()
    setEntrenamientoAEliminar(id)
    setMostrarConfirmEliminar(true)
  }

  const confirmarEliminacion = async () => {
    try {
      await eliminarEntrenamiento(entrenamientoAEliminar)
      setMostrarConfirmEliminar(false)
      setEntrenamientoAEliminar(null)
    } catch (error) {
      alert('Error al eliminar el entrenamiento')
    }
  }

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="historial">
      <h2>Historial de Entrenamientos</h2>

      {entrenamientos.length === 0 ? (
        <div className="empty-state">
          <p>No hay entrenamientos registrados</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Los entrenamientos se crean automáticamente al completar días de tu rutina
          </p>
          <Link to="/rutinas" className="btn btn-primary">
            Ver Rutinas
          </Link>
        </div>
      ) : (
        <div className="entrenamientos-list">
          {entrenamientos.map(entrenamiento => (
            <Link
              key={entrenamiento.id}
              to={`/entrenamiento/${entrenamiento.id}`}
              className="entrenamiento-item"
            >
              <div className="entrenamiento-fecha">
                <div className="fecha-dia">
                  {new Date(entrenamiento.fecha).getDate()}
                </div>
                <div className="fecha-mes">
                  {new Date(entrenamiento.fecha).toLocaleDateString('es', { month: 'short' })}
                </div>
              </div>
              
              <div className="entrenamiento-detalle">
                <div className="entrenamiento-resumen">
                  {entrenamiento.ejercicios.length} ejercicios
                </div>
                <div className="entrenamiento-ejercicios">
                  {entrenamiento.ejercicios.slice(0, 3).map((ej, i) => (
                    <span key={i}>{ej.nombre}</span>
                  )).reduce((prev, curr, i) => i === 0 ? [curr] : [...prev, ' • ', curr], [])}
                  {entrenamiento.ejercicios.length > 3 && ' ...'}
                </div>
              </div>

              <button
                onClick={(e) => handleEliminar(entrenamiento.id, e)}
                className="btn-icon btn-danger"
              >
                🗑️
              </button>
            </Link>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={mostrarConfirmEliminar}
        onClose={() => setMostrarConfirmEliminar(false)}
        onConfirm={confirmarEliminacion}
        title="⚠️ Eliminar Entrenamiento"
        message="¿Estás seguro de eliminar este entrenamiento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        danger={true}
      />
    </div>
  )
}
