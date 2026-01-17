import { useState, useEffect } from 'react'
import { storageService } from '../services/storageAPI'
import { userService } from '../services/userService'

export function useEntrenamientos() {
  const [entrenamientos, setEntrenamientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarEntrenamientos = async () => {
    try {
      setLoading(true)
      const datos = await storageService.obtenerEntrenamientos()
      setEntrenamientos(datos)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarEntrenamientos()
  }, [])

  const agregarEntrenamiento = async (entrenamiento) => {
    try {
      const nuevo = await storageService.guardarEntrenamiento(entrenamiento)
      setEntrenamientos(prev => [nuevo, ...prev])
      return nuevo
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const eliminarEntrenamiento = async (id) => {
    try {
      await storageService.eliminarEntrenamiento(id)
      setEntrenamientos(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    entrenamientos,
    loading,
    error,
    agregarEntrenamiento,
    eliminarEntrenamiento,
    recargar: cargarEntrenamientos
  }
}
