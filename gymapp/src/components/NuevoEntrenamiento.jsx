import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEntrenamientos } from '../hooks/useEntrenamientos'
import './NuevoEntrenamiento.css'

export default function NuevoEntrenamiento() {
  const navigate = useNavigate()
  const { agregarEntrenamiento } = useEntrenamientos()
  const [ejercicios, setEjercicios] = useState([])
  const [ejercicioActual, setEjercicioActual] = useState({
    nombre: '',
    series: [{ repeticiones: '', peso: '' }]
  })

  const agregarSerie = () => {
    setEjercicioActual(prev => ({
      ...prev,
      series: [...prev.series, { repeticiones: '', peso: '' }]
    }))
  }

  const actualizarSerie = (index, campo, valor) => {
    setEjercicioActual(prev => ({
      ...prev,
      series: prev.series.map((serie, i) => 
        i === index ? { ...serie, [campo]: valor } : serie
      )
    }))
  }

  const eliminarSerie = (index) => {
    setEjercicioActual(prev => ({
      ...prev,
      series: prev.series.filter((_, i) => i !== index)
    }))
  }

  const agregarEjercicio = () => {
    if (!ejercicioActual.nombre.trim()) {
      alert('El ejercicio debe tener un nombre')
      return
    }

    const seriesValidas = ejercicioActual.series.filter(
      s => s.repeticiones && s.peso
    )

    if (seriesValidas.length === 0) {
      alert('Agrega al menos una serie con repeticiones y peso')
      return
    }

    setEjercicios(prev => [...prev, {
      ...ejercicioActual,
      series: seriesValidas.map(s => ({
        repeticiones: parseInt(s.repeticiones),
        peso: parseFloat(s.peso)
      }))
    }])

    setEjercicioActual({
      nombre: '',
      series: [{ repeticiones: '', peso: '' }]
    })
  }

  const eliminarEjercicio = (index) => {
    setEjercicios(prev => prev.filter((_, i) => i !== index))
  }

  const guardarEntrenamiento = async () => {
    if (ejercicios.length === 0) {
      alert('Agrega al menos un ejercicio')
      return
    }

    try {
      await agregarEntrenamiento({
        ejercicios,
        fecha: new Date().toISOString()
      })
      navigate('/')
    } catch (error) {
      alert('Error al guardar el entrenamiento')
    }
  }

  return (
    <div className="nuevo-entrenamiento">
      <h2>Nuevo Entrenamiento</h2>

      <div className="form-section">
        <h3>Agregar Ejercicio</h3>
        
        <div className="form-group">
          <label>Nombre del ejercicio</label>
          <input
            type="text"
            value={ejercicioActual.nombre}
            onChange={(e) => setEjercicioActual(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej: Press de banca"
            className="input"
          />
        </div>

        <div className="series-section">
          <label>Series</label>
          {ejercicioActual.series.map((serie, index) => (
            <div key={index} className="serie-row">
              <span className="serie-number">#{index + 1}</span>
              <input
                type="number"
                value={serie.repeticiones}
                onChange={(e) => actualizarSerie(index, 'repeticiones', e.target.value)}
                placeholder="Reps"
                className="input input-small"
                min="1"
              />
              <input
                type="number"
                value={serie.peso}
                onChange={(e) => actualizarSerie(index, 'peso', e.target.value)}
                placeholder="Kg"
                className="input input-small"
                step="0.5"
                min="0"
              />
              {ejercicioActual.series.length > 1 && (
                <button
                  onClick={() => eliminarSerie(index)}
                  className="btn-icon btn-danger"
                  type="button"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
          
          <button onClick={agregarSerie} className="btn btn-secondary btn-small">
            ➕ Agregar serie
          </button>
        </div>

        <button onClick={agregarEjercicio} className="btn btn-primary">
          Agregar ejercicio
        </button>
      </div>

      {ejercicios.length > 0 && (
        <div className="ejercicios-agregados">
          <h3>Ejercicios agregados ({ejercicios.length})</h3>
          {ejercicios.map((ejercicio, index) => (
            <div key={index} className="ejercicio-card">
              <div className="ejercicio-header">
                <strong>{ejercicio.nombre}</strong>
                <button
                  onClick={() => eliminarEjercicio(index)}
                  className="btn-icon btn-danger"
                >
                  🗑️
                </button>
              </div>
              <div className="ejercicio-series">
                {ejercicio.series.map((serie, i) => (
                  <span key={i} className="serie-badge">
                    {serie.repeticiones} reps × {serie.peso} kg
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="actions">
            <button onClick={guardarEntrenamiento} className="btn btn-success btn-large">
              ✓ Guardar Entrenamiento
            </button>
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
