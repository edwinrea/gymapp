import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ejerciciosService } from '../services/ejercicios'
import { useRutinaActiva } from '../hooks/useRutinaActiva'
import './GeneradorRutinas.css'

export default function GeneradorRutinas() {
  const navigate = useNavigate()
  const { iniciarRutina } = useRutinaActiva()
  const [paso, setPaso] = useState(1)
  const [config, setConfig] = useState({
    objetivo: 'hipertrofia',
    nivel: 'intermedio',
    diasSemana: 3,
    equipamiento: ['barra', 'mancuernas', 'maquina', 'barra-fija']
  })
  const [rutinaGenerada, setRutinaGenerada] = useState(null)
  const [ejerciciosCargados, setEjerciciosCargados] = useState([])
  const [loadingEjercicios, setLoadingEjercicios] = useState(false)

  // Cargar ejercicios cuando se genera una rutina
  useEffect(() => {
    if (!rutinaGenerada) return
    
    async function cargarEjerciciosRutina() {
      setLoadingEjercicios(true)
      const todosEjercicios = []
      
      for (const dia of rutinaGenerada.dias) {
        const ejerciciosDia = []
        for (const ejId of dia.ejercicios) {
          const ejercicio = await ejerciciosService.obtenerPorId(ejId)
          if (ejercicio) {
            ejerciciosDia.push(ejercicio)
          } else {
            ejerciciosDia.push({
              id: ejId,
              nombre: ejId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              grupoMuscular: 'general'
            })
          }
        }
        todosEjercicios.push(ejerciciosDia)
      }
      
      setEjerciciosCargados(todosEjercicios)
      setLoadingEjercicios(false)
    }
    
    cargarEjerciciosRutina()
  }, [rutinaGenerada])

  const handleConfigChange = (campo, valor) => {
    setConfig(prev => ({ ...prev, [campo]: valor }))
  }

  const toggleEquipamiento = (equip) => {
    setConfig(prev => ({
      ...prev,
      equipamiento: prev.equipamiento.includes(equip)
        ? prev.equipamiento.filter(e => e !== equip)
        : [...prev.equipamiento, equip]
    }))
  }

  const generarRutina = () => {
    const rutina = ejerciciosService.generarRutina(config)
    setRutinaGenerada(rutina)
    setPaso(2)
  }

  const confirmarRutina = async () => {
    try {
      await iniciarRutina(rutinaGenerada)
      navigate('/rutinas')
    } catch (error) {
      alert('Error al guardar la rutina')
    }
  }

  if (paso === 1) {
    return (
      <div className="generador-rutinas">
        <h2>Generar Rutina Personalizada</h2>
        
        <div className="config-section">
          <div className="form-group">
            <label>Objetivo Principal</label>
            <div className="options-grid">
              <button
                className={`option-btn ${config.objetivo === 'fuerza' ? 'active' : ''}`}
                onClick={() => handleConfigChange('objetivo', 'fuerza')}
              >
                💪 Fuerza
              </button>
              <button
                className={`option-btn ${config.objetivo === 'hipertrofia' ? 'active' : ''}`}
                onClick={() => handleConfigChange('objetivo', 'hipertrofia')}
              >
                🏋️ Hipertrofia
              </button>
              <button
                className={`option-btn ${config.objetivo === 'general' ? 'active' : ''}`}
                onClick={() => handleConfigChange('objetivo', 'general')}
              >
                ⚡ General
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Nivel de Experiencia</label>
            <div className="options-grid">
              <button
                className={`option-btn ${config.nivel === 'principiante' ? 'active' : ''}`}
                onClick={() => handleConfigChange('nivel', 'principiante')}
              >
                🌱 Principiante
              </button>
              <button
                className={`option-btn ${config.nivel === 'intermedio' ? 'active' : ''}`}
                onClick={() => handleConfigChange('nivel', 'intermedio')}
              >
                📈 Intermedio
              </button>
              <button
                className={`option-btn ${config.nivel === 'avanzado' ? 'active' : ''}`}
                onClick={() => handleConfigChange('nivel', 'avanzado')}
              >
                🔥 Avanzado
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Días por Semana</label>
            <div className="slider-container">
              <input
                type="range"
                min="2"
                max="6"
                value={config.diasSemana}
                onChange={(e) => handleConfigChange('diasSemana', parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-value">{config.diasSemana} días</div>
            </div>
          </div>

          <div className="form-group">
            <label>Equipamiento Disponible</label>
            <div className="equipamiento-grid">
              {['barra', 'mancuernas', 'maquina', 'barra-fija'].map(equip => (
                <button
                  key={equip}
                  className={`checkbox-btn ${config.equipamiento.includes(equip) ? 'active' : ''}`}
                  onClick={() => toggleEquipamiento(equip)}
                >
                  {config.equipamiento.includes(equip) ? '✓ ' : ''}
                  {equip.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generarRutina} className="btn btn-primary btn-large">
            Generar Rutina
          </button>
        </div>
      </div>
    )
  }

  // Paso 2: Vista previa de la rutina
  return (
    <div className="generador-rutinas">
      <button onClick={() => setPaso(1)} className="btn-back">
        ← Volver
      </button>

      <div className="rutina-preview">
        <h2>{rutinaGenerada.nombre}</h2>
        <p className="rutina-descripcion">{rutinaGenerada.descripcion}</p>

        <div className="rutina-meta">
          <span className="badge">📅 {rutinaGenerada.diasSemana} días/semana</span>
          <span className="badge">🎯 {rutinaGenerada.objetivo}</span>
          <span className="badge">📊 {rutinaGenerada.nivel}</span>
        </div>

        {loadingEjercicios ? (
          <div className="loading">Cargando ejercicios...</div>
        ) : (
          <div className="dias-list">
            {rutinaGenerada.dias.map((dia, diaIndex) => (
              <div key={diaIndex} className="dia-card">
                <h3>{dia.nombre}</h3>
                <div className="ejercicios-preview">
                  {ejerciciosCargados[diaIndex]?.map((ejercicio, ejIndex) => (
                    <div key={ejIndex} className="ejercicio-preview-item">
                      <span className="ejercicio-nombre">{ejercicio.nombre}</span>
                      <span className="ejercicio-config">
                        {dia.series[ejIndex]} × {dia.reps[ejIndex]} reps
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="actions">
          <button onClick={confirmarRutina} className="btn btn-success btn-large">
            ✓ Comenzar Esta Rutina
          </button>
          <button onClick={() => setPaso(1)} className="btn btn-secondary">
            Generar Otra
          </button>
        </div>
      </div>
    </div>
  )
}
