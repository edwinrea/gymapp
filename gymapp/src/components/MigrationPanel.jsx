import { useState, useEffect } from 'react'
import { migrationService } from '../services/migrationService'
import './MigrationPanel.css'

export function MigrationPanel() {
  const [datosLegacy, setDatosLegacy] = useState(null)
  const [migrando, setMigrando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [mostrarPanel, setMostrarPanel] = useState(false)

  useEffect(() => {
    verificarDatos()
  }, [])

  const verificarDatos = async () => {
    try {
      const datos = await migrationService.verificarDatosLegacy()
      setDatosLegacy(datos)
      setMostrarPanel(datos.hayDatos)
    } catch (error) {
      console.error('Error verificando datos:', error)
    }
  }

  const ejecutarMigracion = async () => {
    try {
      setMigrando(true)
      setResultado(null)
      
      const resultado = await migrationService.migrarTodosLosDatos()
      setResultado(resultado)
      
      // Actualizar datos legacy después de la migración
      await verificarDatos()
      
    } catch (error) {
      console.error('Error en migración:', error)
      setResultado({ errores: [error.message] })
    } finally {
      setMigrando(false)
    }
  }

  const limpiarDatos = async () => {
    try {
      await migrationService.limpiarDatosLegacy()
      await verificarDatos()
      setResultado(null)
    } catch (error) {
      console.error('Error limpiando datos:', error)
    }
  }

  if (!mostrarPanel) {
    return null
  }

  return (
    <div className="migration-panel">
      <div className="migration-card">
        <h3>🔄 Migración de Datos</h3>
        <p>Se encontraron datos del sistema anterior:</p>
        
        {datosLegacy && (
          <ul className="datos-legacy">
            <li>👥 {datosLegacy.usuarios} usuarios</li>
            <li>💪 {datosLegacy.entrenamientos} entrenamientos</li>
            <li>📋 {datosLegacy.rutinas} rutinas</li>
          </ul>
        )}

        <div className="migration-actions">
          <button 
            className="btn btn-primary"
            onClick={ejecutarMigracion}
            disabled={migrando}
          >
            {migrando ? 'Migrando...' : 'Migrar Datos'}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => setMostrarPanel(false)}
          >
            Cancelar
          </button>
        </div>

        {resultado && (
          <div className="migration-result">
            {resultado.errores.length === 0 ? (
              <div className="success">
                <h4>✅ Migración Exitosa</h4>
                <ul>
                  <li>👥 {resultado.usuarios} usuarios migrados</li>
                  <li>💪 {resultado.entrenamientos} entrenamientos migrados</li>
                  <li>📋 {resultado.rutinas} rutinas migradas</li>
                </ul>
                
                <button 
                  className="btn btn-primary btn-small"
                  onClick={limpiarDatos}
                >
                  Limpiar Datos Antiguos
                </button>
              </div>
            ) : (
              <div className="error">
                <h4>❌ Errores en Migración</h4>
                <ul>
                  {resultado.errores.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MigrationPanel