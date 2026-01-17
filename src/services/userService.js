import { apiService } from './apiService'
import { storageService } from './storage'
import { rutinasStorageService } from './rutinasStorage'

/**
 * Servicio para gestión de usuarios con backend SQLite
 * Migrado de LocalForage a API REST
 */

/**
 * Obtener todos los usuarios
 */
export const obtenerUsuarios = async () => {
  try {
    const usuarios = await apiService.getUsuarios()
    return usuarios.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion))
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return []
  }
}

/**
 * Crear nuevo usuario
 */
export const crearUsuario = async (nombre, avatar = '👤', pin = null) => {
  try {
    // Validar que no exista el nombre
    const users = await obtenerUsuarios()
    if (users.find(u => u.nombre.toLowerCase() === nombre.toLowerCase())) {
      throw new Error('Ya existe un usuario con ese nombre')
    }
    
    // Validar PIN si se proporciona
    if (pin && (pin.length !== 4 || !/^\d{4}$/.test(pin))) {
      throw new Error('El PIN debe ser de 4 dígitos')
    }
    
    const userData = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      avatar,
      pin: pin || null,
      fechaCreacion: new Date().toISOString()
    }
    
    const usuarioCreado = await apiService.crearUsuario(userData)
    await establecerUsuarioActual(usuarioCreado.id)
    return usuarioCreado
  } catch (error) {
    console.error('Error creando usuario:', error)
    throw error
  }
}

/**
 * Obtener usuario actual
 */
export const obtenerUsuarioActual = async () => {
  try {
    return await apiService.obtenerSesionActual()
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error)
    return null
  }
}

/**
 * Establecer usuario actual
 */
export const establecerUsuarioActual = async (userId) => {
  try {
    await apiService.establecerSesion(userId)
  } catch (error) {
    console.error('Error estableciendo usuario actual:', error)
    throw error
  }
}

/**
 * Cerrar sesión
 */
export const cerrarSesion = async () => {
  try {
    await apiService.cerrarSesion()
  } catch (error) {
    console.error('Error cerrando sesión:', error)
    throw error
  }
}

/**
 * Eliminar usuario (y todos sus datos)
 */
export const eliminarUsuario = async (userId) => {
  try {
    // La API ya elimina todos los datos relacionados
    await apiService.eliminarUsuario(userId)
    
    // Limpiar datos locales legacy si existen
    await limpiarDatosUsuarioLocal(userId)
    
    // Si es el usuario actual, cerrar sesión
    const currentUser = await obtenerUsuarioActual()
    if (currentUser?.id === userId) {
      await cerrarSesion()
    }
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    throw error
  }
}

/**
 * Limpiar datos locales legacy de un usuario
 */
const limpiarDatosUsuarioLocal = async (userId) => {
  try {
    // Limpiar entrenamientos locales
    const entrenamientos = await storageService.obtenerEntrenamientos()
    for (const entrenamiento of entrenamientos) {
      if (entrenamiento.id && entrenamiento.id.toString().includes(userId)) {
        await storageService.eliminarEntrenamiento(entrenamiento.id)
      }
    }
    
    // Limpiar rutinas locales
    const rutina = await rutinasStorageService.obtenerRutinaActiva()
    if (rutina && rutina.userId === userId) {
      await rutinasStorageService.eliminarRutinaActiva()
    }
  } catch (error) {
    console.warn('Error limpiando datos locales legacy:', error)
  }
}

/**
 * Actualizar avatar del usuario
 */
export const actualizarAvatar = async (userId, avatar) => {
  try {
    // Esta funcionalidad requiere endpoint específico en la API
    // Por ahora, recrear usuario con nuevo avatar
    const usuarios = await obtenerUsuarios()
    const usuario = usuarios.find(u => u.id === userId)
    
    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    // Eliminar usuario actual
    await apiService.eliminarUsuario(userId)
    
    // Recrear con nuevo avatar
    const usuarioActualizado = {
      ...usuario,
      avatar,
      id: Date.now().toString() // Nuevo ID
    }
    
    const nuevoUsuario = await apiService.crearUsuario(usuarioActualizado)
    await establecerUsuarioActual(nuevoUsuario.id)
    
    return nuevoUsuario
  } catch (error) {
    console.error('Error actualizando avatar:', error)
    throw error
  }
}

/**
 * Verificar PIN de usuario
 */
export const verificarPin = async (userId, pin) => {
  try {
    const usuarios = await obtenerUsuarios()
    const usuario = usuarios.find(u => u.id === userId)
    
    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }
    
    // Si el usuario no tiene PIN, permitir acceso
    if (!usuario.pin) {
      return true
    }
    
    return usuario.pin === pin
  } catch (error) {
    console.error('Error verificando PIN:', error)
    return false
  }
}

export const userService = {
  obtenerUsuarios,
  crearUsuario,
  obtenerUsuarioActual,
  establecerUsuarioActual,
  cerrarSesion,
  eliminarUsuario,
  actualizarAvatar,
  verificarPin
}

export default userService
