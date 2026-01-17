import { useState, useEffect } from 'react'
import { rutinasStorageService } from '../services/rutinasStorageAPI'
import { storageService } from '../services/storageAPI'
import { userService } from '../services/userService'

export function useRutinaActiva() {
  const [rutinaActiva, setRutinaActiva] = useState(null)
  const [loading, setLoading] = useState(true)
  const [estadisticas, setEstadisticas] = useState(null)

  const cargarRutina = async () => {
    try {
      setLoading(true)
      const rutina = await rutinasStorageService.obtenerRutinaActiva()
      
      // Verificar que la rutina tenga la estructura correcta
      if (rutina) {
        // Asegurar que progreso existe y tiene la longitud correcta
        if (!rutina.progreso || rutina.progreso.length !== rutina.dias.length) {
          rutina.progreso = rutina.dias.map((dia, index) => ({
            nombreDia: dia.nombre,
            completado: false,
            entrenamientos: [],
            ultimaFecha: null
          }))
          
          // Guardar la rutina corregida
          await rutinasStorageService.guardarRutinaActiva(rutina)
        }
      }
      
      setRutinaActiva(rutina)
      
      if (rutina) {
        const stats = await rutinasStorageService.obtenerEstadisticas()
        setEstadisticas(stats)
      }
    } catch (error) {
      console.error('Error al cargar rutina:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarRutina()
  }, [])

  const iniciarRutina = async (rutina) => {
    try {
      const nueva = await rutinasStorageService.guardarRutinaActiva(rutina)
      setRutinaActiva(nueva)
      await cargarRutina()
    } catch (error) {
      console.error('Error al iniciar rutina:', error)
      throw error
    }
  }

  const marcarDiaCompletado = async (indiceDia, entrenamientoId) => {
    try {
      const actualizada = await rutinasStorageService.marcarDiaCompletado(indiceDia, entrenamientoId)
      setRutinaActiva(actualizada)
      await cargarRutina()
    } catch (error) {
      console.error('Error al marcar día completado:', error)
      throw error
    }
  }

  const finalizarRutina = async () => {
    try {
      await rutinasStorageService.eliminarRutinaActiva()
      setRutinaActiva(null)
      setEstadisticas(null)
    } catch (error) {
      console.error('Error al finalizar rutina:', error)
      throw error
    }
  }

  return {
    rutinaActiva,
    loading,
    estadisticas,
    iniciarRutina,
    marcarDiaCompletado,
    finalizarRutina,
    recargar: cargarRutina
  }
}
