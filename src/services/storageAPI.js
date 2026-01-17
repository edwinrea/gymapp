import { apiService } from './apiService'
import { userService } from './userService'

/**
 * Servicio para manejo de entrenamientos con backend SQLite
 * Migrado de LocalForage a API REST
 */

/**
 * Guardar un nuevo entrenamiento para el usuario actual
 */
const guardarEntrenamiento = async (entrenamiento) => {
  try {
    const usuarioActual = await userService.obtenerUsuarioActual()
    if (!usuarioActual) {
      throw new Error('No hay usuario logueado')
    }

    const entrenamientoData = {
      id: entrenamiento.id || Date.now(),
      fecha: entrenamiento.fecha || new Date().toISOString(),
      ejercicios: entrenamiento.ejercicios || []
    }

    return await apiService.guardarEntrenamiento(usuarioActual.id, entrenamientoData)
  } catch (error) {
    console.error('Error guardando entrenamiento:', error)
    throw error
  }
}

/**
 * Obtener todos los entrenamientos del usuario actual
 */
const obtenerEntrenamientos = async () => {
  try {
    const usuarioActual = await userService.obtenerUsuarioActual()
    if (!usuarioActual) {
      return []
    }

    return await apiService.obtenerEntrenamientos(usuarioActual.id)
  } catch (error) {
    console.error('Error obteniendo entrenamientos:', error)
    return []
  }
}

/**
 * Obtener un entrenamiento específico por ID
 */
const obtenerEntrenamiento = async (id) => {
  try {
    const usuarioActual = await userService.obtenerUsuarioActual()
    if (!usuarioActual) {
      return null
    }

    return await apiService.obtenerEntrenamiento(usuarioActual.id, id)
  } catch (error) {
    console.error('Error obteniendo entrenamiento:', error)
    return null
  }
}

/**
 * Eliminar un entrenamiento por ID
 */
const eliminarEntrenamiento = async (id) => {
  try {
    const usuarioActual = await userService.obtenerUsuarioActual()
    if (!usuarioActual) {
      throw new Error('No hay usuario logueado')
    }

    return await apiService.eliminarEntrenamiento(usuarioActual.id, id)
  } catch (error) {
    console.error('Error eliminando entrenamiento:', error)
    throw error
  }
}

/**
 * Actualizar un entrenamiento existente
 */
const actualizarEntrenamiento = async (id, datosActualizados) => {
  try {
    const usuarioActual = await userService.obtenerUsuarioActual()
    if (!usuarioActual) {
      throw new Error('No hay usuario logueado')
    }

    // Obtener el entrenamiento actual
    const entrenamientoActual = await obtenerEntrenamiento(id)
    if (!entrenamientoActual) {
      throw new Error('Entrenamiento no encontrado')
    }

    // Combinar datos existentes con los nuevos
    const entrenamientoActualizado = {
      ...entrenamientoActual,
      ...datosActualizados,
      id, // Mantener el ID original
      fechaModificacion: new Date().toISOString()
    }

    // Usar el endpoint de crear/guardar ya que reemplaza por ID
    return await apiService.guardarEntrenamiento(usuarioActual.id, entrenamientoActualizado)
  } catch (error) {
    console.error('Error actualizando entrenamiento:', error)
    throw error
  }
}

/**
 * Obtener estadísticas de entrenamientos
 */
const obtenerEstadisticas = async () => {
  try {
    const entrenamientos = await obtenerEntrenamientos()
    
    if (entrenamientos.length === 0) {
      return {
        totalEntrenamientos: 0,
        diasConsecutivos: 0,
        promedioEjerciciosPorSesion: 0,
        ultimoEntrenamiento: null
      }
    }

    // Ordenar por fecha
    const entrenamientosOrdenados = entrenamientos
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    const ultimoEntrenamiento = entrenamientosOrdenados[0]

    // Calcular días consecutivos
    const diasConsecutivos = calcularDiasConsecutivos(entrenamientosOrdenados)

    // Promedio de ejercicios por sesión
    const totalEjercicios = entrenamientos.reduce(
      (total, entrenamiento) => total + entrenamiento.ejercicios.length, 
      0
    )
    const promedioEjerciciosPorSesion = Math.round(totalEjercicios / entrenamientos.length)

    return {
      totalEntrenamientos: entrenamientos.length,
      diasConsecutivos,
      promedioEjerciciosPorSesion,
      ultimoEntrenamiento
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return {
      totalEntrenamientos: 0,
      diasConsecutivos: 0,
      promedioEjerciciosPorSesion: 0,
      ultimoEntrenamiento: null
    }
  }
}

/**
 * Calcular días consecutivos de entrenamiento
 */
const calcularDiasConsecutivos = (entrenamientosOrdenados) => {
  if (entrenamientosOrdenados.length === 0) return 0

  let diasConsecutivos = 1
  let fechaAnterior = new Date(entrenamientosOrdenados[0].fecha)

  for (let i = 1; i < entrenamientosOrdenados.length; i++) {
    const fechaActual = new Date(entrenamientosOrdenados[i].fecha)
    const diferenciaDias = Math.floor((fechaAnterior - fechaActual) / (1000 * 60 * 60 * 24))

    if (diferenciaDias === 1) {
      diasConsecutivos++
      fechaAnterior = fechaActual
    } else {
      break
    }
  }

  return diasConsecutivos
}

/**
 * Migrar datos de LocalForage a la API (función helper)
 */
const migrarDatosLocal = async () => {
  try {
    // Esta función podría implementarse para migrar datos existentes
    console.log('Migración de datos locales no implementada')
  } catch (error) {
    console.error('Error migrando datos:', error)
  }
}

export const storageService = {
  guardarEntrenamiento,
  obtenerEntrenamientos,
  obtenerEntrenamiento,
  eliminarEntrenamiento,
  actualizarEntrenamiento,
  obtenerEstadisticas,
  migrarDatosLocal
}

export default storageService