import { Link } from 'react-router-dom'
import { useEntrenamientos } from '../hooks/useEntrenamientos'
import { useRutinaActiva } from '../hooks/useRutinaActiva'
import { storageService } from '../services/storage'
import { userService } from '../services/userService'
import { useState, useEffect } from 'react'
import './Home.css'

export default function Home() {
  const { entrenamientos, loading } = useEntrenamientos()
  const { rutinaActiva, estadisticas } = useRutinaActiva()
  const [estadisticasEntr, setEstadisticasEntr] = useState(null)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const cargarDatos = async () => {
      const stats = await storageService.obtenerEstadisticas()
      setEstadisticasEntr(stats)
      const user = await userService.obtenerUsuarioActual()
      setUsuario(user)
    }
    cargarDatos()
  }, [entrenamientos])

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  const ultimosEntrenamientos = entrenamientos.slice(0, 3)

  return (
    <div className="home">
      {usuario && (
        <div className="welcome-banner">
          <span className="welcome-avatar">{usuario.avatar}</span>
          <div className="welcome-text">
            <h2>¡Hola, {usuario.nombre}!</h2>
            <p>Bienvenido a tu espacio de entrenamiento</p>
          </div>
        </div>
      )}

      {rutinaActiva && estadisticas && (
        <section className="rutina-activa-card">
          <div className="rutina-activa-header">
            <div className="rutina-info">
              <h3>🎯 Rutina Activa</h3>
              <p className="rutina-nombre">{estadisticas.nombreRutina}</p>
            </div>
          </div>
          <div className="rutina-progreso-mini">
            <div className="progreso-bar-mini">
              <div 
                className="progreso-fill-mini" 
                style={{ width: `${estadisticas.porcentaje}%` }}
              />
            </div>
            <div className="progreso-stats">
              <span className="progreso-text">
                {estadisticas.diasCompletados}/{estadisticas.totalDias} días completados
              </span>
              <span className="progreso-percent">{estadisticas.porcentaje}%</span>
            </div>
          </div>
          <Link to="/rutinas" className="btn-ver-rutina">
            Ver rutina completa →
          </Link>
        </section>
      )}

      <section className="stats-section">
        <h2>Resumen</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{estadisticasEntr?.totalEntrenamientos || 0}</div>
            <div className="stat-label">Entrenamientos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{estadisticasEntr?.totalEjercicios || 0}</div>
            <div className="stat-label">Ejercicios</div>
          </div>
        </div>
      </section>

      <section className="quick-actions">
        {!rutinaActiva && (
          <Link to="/generar-rutina" className="btn btn-primary btn-large">
            🎯 Generar Rutina Personalizada
          </Link>
        )}
      </section>

      {ultimosEntrenamientos.length > 0 && (
        <section className="recent-section">
          <div className="section-header">
            <h2>Últimos Entrenamientos</h2>
            <Link to="/historial" className="link">Ver todos</Link>
          </div>
          <div className="workouts-list">
            {ultimosEntrenamientos.map(entrenamiento => (
              <Link 
                key={entrenamiento.id} 
                to={`/entrenamiento/${entrenamiento.id}`}
                className="workout-card"
              >
                <div className="workout-date">
                  {new Date(entrenamiento.fecha).toLocaleDateString('es', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
                <div className="workout-info">
                  <div className="workout-exercises">
                    {entrenamiento.ejercicios.length} ejercicios
                  </div>
                </div>
                <div className="workout-arrow">›</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {entrenamientos.length === 0 && (
        <div className="empty-state">
          <p>🏋️ Aún no has registrado entrenamientos</p>
          <p>¡Comienza ahora y sigue tu progreso!</p>
        </div>
      )}
    </div>
  )
}
