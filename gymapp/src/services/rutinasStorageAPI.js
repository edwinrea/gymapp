import { apiService } from './apiService'
import { userService } from './userService'

/**
 * Servicio para manejo de rutinas con backend SQLite
 * Migrado de LocalForage a API REST
 */

/**
 * Guardar rutina activa del usuario actual
 */
const guardarRutinaActiva = async (rutina) => {
  try {
    const usuarioActual = await userService.obtenerUsuarioActual()
    if (!usuarioActual) {
      throw new Error('No hay usuario logueado')
    }

    return await apiService.guardarRutinaActiva(usuarioActual.id, rutina)
  } catch (error) {
    console.error('Error guardando rutina activa:', error)
    throw error
  }
}

/**
 * Obtener rutina activa del usuario actual
 */
const obtenerRutinaActiva = async () => {
  try {
    const usuarioActual = await userService.obtenerUsuarioActual()
    if (!usuarioActual) {
      return null
    }

    return await apiService.obtenerRutinaActiva(usuarioActual.id)
  } catch (error) {
    console.error('Error obteniendo rutina activa:', error)
    return null
  }
}

/**
 * Eliminar rutina activa del usuario actual
 */
const eliminarRutinaActiva = async () => {
  try {
    const usuarioActual = await userService.obtenerUsuarioActual()
    if (!usuarioActual) {
      throw new Error('No hay usuario logueado')
    }

    return await apiService.eliminarRutinaActiva(usuarioActual.id)
  } catch (error) {
    console.error('Error eliminando rutina activa:', error)
    throw error
  }
}

/**
 * Obtener estadísticas de rutina
 */
const obtenerEstadisticas = async () => {
  try {
    const rutina = await obtenerRutinaActiva()
    
    if (!rutina || !rutina.progreso) {
      return {
        diasCompletados: 0,
        diasTotales: 0,
        porcentajeCompletado: 0,
        diasConsecutivos: 0,
        ultimoEntrenamiento: null
      }
    }

    const diasCompletados = rutina.progreso.filter(dia => dia.completado).length
    const diasTotales = rutina.progreso.length
    const porcentajeCompletado = diasTotales > 0 ? Math.round((diasCompletados / diasTotales) * 100) : 0

    // Encontrar último día entrenado
    const diasConEntrenamientos = rutina.progreso
      .filter(dia => dia.entrenamientos && dia.entrenamientos.length > 0)
      .sort((a, b) => new Date(b.ultimaFecha || 0) - new Date(a.ultimaFecha || 0))

    const ultimoEntrenamiento = diasConEntrenamientos[0]?.ultimaFecha || null

    // Calcular días consecutivos (simplificado)
    const diasConsecutivos = calcularDiasConsecutivosRutina(rutina.progreso)

    return {
      diasCompletados,
      diasTotales,
      porcentajeCompletado,
      diasConsecutivos,
      ultimoEntrenamiento
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas de rutina:', error)
    return {
      diasCompletados: 0,
      diasTotales: 0,
      porcentajeCompletado: 0,
      diasConsecutivos: 0,
      ultimoEntrenamiento: null
    }
  }
}

/**
 * Calcular días consecutivos en rutina
 */
const calcularDiasConsecutivosRutina = (progreso) => {
  if (!progreso || progreso.length === 0) return 0

  // Buscar secuencia más larga de días completados
  let maxConsecutivos = 0
  let consecutivosActuales = 0

  for (const dia of progreso) {
    if (dia.completado) {
      consecutivosActuales++
      maxConsecutivos = Math.max(maxConsecutivos, consecutivosActuales)
    } else {
      consecutivosActuales = 0
    }
  }

  return maxConsecutivos
}

/**
 * Marcar día como completado en la rutina activa
 * @param {number|string} indiceDiaONombre - Índice del día o nombre del día
 * @param {string} entrenamientoId - ID del entrenamiento completado
 */
const marcarDiaCompletado = async (indiceDiaONombre, entrenamientoId) => {
  try {
    const rutina = await obtenerRutinaActiva()
    if (!rutina) {
      throw new Error('No hay rutina activa')
    }

    // Actualizar progreso del día (soporta tanto índice como nombre)
    const progresoActualizado = rutina.progreso.map((dia, index) => {
      const coincide = typeof indiceDiaONombre === 'number' 
        ? index === indiceDiaONombre
        : dia.nombreDia === indiceDiaONombre
        
      if (coincide) {
        return {
          ...dia,
          completado: true,
          entrenamientos: [...(dia.entrenamientos || []), entrenamientoId],
          ultimaFecha: new Date().toISOString()
        }
      }
      return dia
    })

    const rutinaActualizada = {
      ...rutina,
      progreso: progresoActualizado
    }

    return await guardarRutinaActiva(rutinaActualizada)
  } catch (error) {
    console.error('Error marcando día completado:', error)
    throw error
  }
}

/**
 * Migrar datos de LocalForage a la API (función helper)
 */
const migrarDatosLocal = async () => {
  try {
    // Esta función podría implementarse para migrar rutinas existentes
    console.log('Migración de rutinas locales no implementada')
  } catch (error) {
    console.error('Error migrando rutinas:', error)
  }
}

export const rutinasStorageService = {
  guardarRutinaActiva,
  obtenerRutinaActiva,
  eliminarRutinaActiva,
  obtenerEstadisticas,
  marcarDiaCompletado,
  migrarDatosLocal
}

export default rutinasStorageService