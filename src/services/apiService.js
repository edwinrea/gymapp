const API_URL = import.meta.env.VITE_API_URL || ''

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_URL}/api${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Error de red' }))
        throw new Error(error.error || `HTTP ${response.status}`)
      }

      // Manejar respuestas vacías
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return null
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Usuarios
  async getUsuarios() {
    return await this.request('/users')
  }

  async crearUsuario(userData) {
    return await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async eliminarUsuario(userId) {
    return await this.request(`/users/${userId}`, {
      method: 'DELETE'
    })
  }

  // Sesiones
  async obtenerSesionActual() {
    return await this.request('/session')
  }

  async establecerSesion(userId) {
    return await this.request('/session', {
      method: 'POST',
      body: JSON.stringify({ userId })
    })
  }

  async cerrarSesion() {
    return await this.request('/session', {
      method: 'DELETE'
    })
  }

  // Entrenamientos
  async obtenerEntrenamientos(userId) {
    return await this.request(`/entrenamientos/${userId}`)
  }

  async obtenerEntrenamiento(userId, id) {
    return await this.request(`/entrenamientos/${userId}/${id}`)
  }

  async guardarEntrenamiento(userId, entrenamiento) {
    return await this.request(`/entrenamientos/${userId}`, {
      method: 'POST',
      body: JSON.stringify(entrenamiento)
    })
  }

  async eliminarEntrenamiento(userId, id) {
    return await this.request(`/entrenamientos/${userId}/${id}`, {
      method: 'DELETE'
    })
  }

  // Rutinas
  async obtenerRutinaActiva(userId) {
    return await this.request(`/rutina-activa/${userId}`)
  }

  async guardarRutinaActiva(userId, rutina) {
    return await this.request(`/rutina-activa/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(rutina)
    })
  }

  async eliminarRutinaActiva(userId) {
    return await this.request(`/rutina-activa/${userId}`, {
      method: 'DELETE'
    })
  }
}

export const apiService = new ApiService()
export default apiService