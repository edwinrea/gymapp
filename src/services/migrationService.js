import { userService } from '../services/userService'
import { storageService } from '../services/storageAPI'
import { rutinasStorageService } from '../services/rutinasStorageAPI'
import localforage from 'localforage'

/**
 * Migrar datos de LocalForage a la nueva API SQLite
 * Ejecutar esta función una vez para transferir datos existentes
 */

// Configurar stores legacy
const legacyUserStorage = localforage.createInstance({
  name: 'gymapp',
  storeName: 'users'
})

const legacyEntrenamientosStorage = localforage.createInstance({
  name: 'GymApp',
  storeName: 'entrenamientos'
})

const legacyRutinasStorage = localforage.createInstance({
  name: 'GymApp',
  storeName: 'rutinas'
})

export const migrationService = {
  /**
   * Migrar todos los datos
   */
  async migrarTodosLosDatos() {
    try {
      console.log('🔄 Iniciando migración de datos...')
      
      const resultados = {
        usuarios: 0,
        entrenamientos: 0,
        rutinas: 0,
        errores: []
      }

      // 1. Migrar usuarios
      try {
        resultados.usuarios = await this.migrarUsuarios()
      } catch (error) {
        resultados.errores.push(`Error migrando usuarios: ${error.message}`)
      }

      // 2. Migrar entrenamientos por usuario
      try {
        const usuarios = await userService.obtenerUsuarios()
        for (const usuario of usuarios) {
          await userService.establecerUsuarioActual(usuario.id)
          const entrenamientosMigrados = await this.migrarEntrenamientos()
          resultados.entrenamientos += entrenamientosMigrados
        }
      } catch (error) {
        resultados.errores.push(`Error migrando entrenamientos: ${error.message}`)
      }

      // 3. Migrar rutinas por usuario
      try {
        const usuarios = await userService.obtenerUsuarios()
        for (const usuario of usuarios) {
          await userService.establecerUsuarioActual(usuario.id)
          const rutinasMigradas = await this.migrarRutinas()
          resultados.rutinas += rutinasMigradas
        }
      } catch (error) {
        resultados.errores.push(`Error migrando rutinas: ${error.message}`)
      }

      console.log('✅ Migración completada:', resultados)
      return resultados

    } catch (error) {
      console.error('❌ Error en migración:', error)
      throw error
    }
  },

  /**
   * Migrar usuarios
   */
  async migrarUsuarios() {
    try {
      const legacyUsers = await legacyUserStorage.getItem('gymapp_users') || []
      let migrados = 0

      for (const usuario of legacyUsers) {
        try {
          await userService.crearUsuario(usuario.nombre, usuario.avatar, usuario.pin)
          migrados++
        } catch (error) {
          console.warn(`Error migrando usuario ${usuario.nombre}:`, error.message)
        }
      }

      console.log(`👥 Usuarios migrados: ${migrados}/${legacyUsers.length}`)
      return migrados

    } catch (error) {
      console.error('Error migrando usuarios:', error)
      return 0
    }
  },

  /**
   * Migrar entrenamientos del usuario actual
   */
  async migrarEntrenamientos() {
    try {
      const usuarioActual = await userService.obtenerUsuarioActual()
      if (!usuarioActual) {
        console.warn('No hay usuario actual para migrar entrenamientos')
        return 0
      }

      const entrenamientos = []
      
      // Iterar sobre todos los entrenamientos en LocalForage
      await legacyEntrenamientosStorage.iterate((value, key) => {
        if (key.startsWith('entrenamiento_')) {
          entrenamientos.push(value)
        }
      })

      let migrados = 0
      for (const entrenamiento of entrenamientos) {
        try {
          await storageService.guardarEntrenamiento({
            id: entrenamiento.id,
            fecha: entrenamiento.fecha,
            ejercicios: entrenamiento.ejercicios
          })
          migrados++
        } catch (error) {
          console.warn(`Error migrando entrenamiento ${entrenamiento.id}:`, error.message)
        }
      }

      console.log(`💪 Entrenamientos migrados para ${usuarioActual.nombre}: ${migrados}/${entrenamientos.length}`)
      return migrados

    } catch (error) {
      console.error('Error migrando entrenamientos:', error)
      return 0
    }
  },

  /**
   * Migrar rutinas del usuario actual
   */
  async migrarRutinas() {
    try {
      const usuarioActual = await userService.obtenerUsuarioActual()
      if (!usuarioActual) {
        console.warn('No hay usuario actual para migrar rutinas')
        return 0
      }

      // Migrar rutina activa
      const rutinaActiva = await legacyRutinasStorage.getItem('rutina_activa')
      if (rutinaActiva) {
        try {
          await rutinasStorageService.guardarRutinaActiva(rutinaActiva)
          console.log(`📋 Rutina activa migrada para ${usuarioActual.nombre}`)
          return 1
        } catch (error) {
          console.warn(`Error migrando rutina activa:`, error.message)
          return 0
        }
      }

      return 0

    } catch (error) {
      console.error('Error migrando rutinas:', error)
      return 0
    }
  },

  /**
   * Verificar si hay datos legacy para migrar
   */
  async verificarDatosLegacy() {
    try {
      const usuarios = await legacyUserStorage.getItem('gymapp_users') || []
      const rutinaActiva = await legacyRutinasStorage.getItem('rutina_activa')
      
      let entrenamientos = 0
      await legacyEntrenamientosStorage.iterate(() => {
        entrenamientos++
      })

      return {
        usuarios: usuarios.length,
        entrenamientos,
        rutinas: rutinaActiva ? 1 : 0,
        hayDatos: usuarios.length > 0 || entrenamientos > 0 || rutinaActiva
      }

    } catch (error) {
      console.error('Error verificando datos legacy:', error)
      return { usuarios: 0, entrenamientos: 0, rutinas: 0, hayDatos: false }
    }
  },

  /**
   * Limpiar datos legacy después de migración exitosa
   */
  async limpiarDatosLegacy() {
    try {
      await legacyUserStorage.clear()
      await legacyEntrenamientosStorage.clear()
      await legacyRutinasStorage.clear()
      console.log('🧹 Datos legacy limpiados')
    } catch (error) {
      console.error('Error limpiando datos legacy:', error)
    }
  }
}

export default migrationService