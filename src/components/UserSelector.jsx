import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'
import './UserSelector.css'

const AVATARES = ['👤', '👨', '👩', '🧑', '👱', '🧔', '👴', '👵', '💪', '🏋️', '🤸', '🚴']

export default function UserSelector({ onUsuarioSeleccionado }) {
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [avatarSeleccionado, setAvatarSeleccionado] = useState('👤')
  const [nuevoPin, setNuevoPin] = useState('')
  const [confirmarPin, setConfirmarPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creando, setCreando] = useState(false)
  const [exito, setExito] = useState('')
  const [verificandoPin, setVerificandoPin] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [pinIngresado, setPinIngresado] = useState('')
  const [modoVerificacion, setModoVerificacion] = useState('login') // 'login' o 'eliminar'
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      const users = await userService.obtenerUsuarios()
      setUsuarios(users)
      setLoading(false)
    } catch (err) {
      setError('Error cargando usuarios')
      setLoading(false)
    }
  }

  const handleSeleccionarUsuario = async (usuario) => {
    // Si tiene PIN, mostrar verificación
    if (usuario.pin) {
      setUsuarioSeleccionado(usuario)
      setVerificandoPin(true)
      setModoVerificacion('login')
      setPinIngresado('')
      setError('')
    } else {
      // Sin PIN, entrar directamente
      try {
        await userService.establecerUsuarioActual(usuario.id)
        if (onUsuarioSeleccionado) {
          await onUsuarioSeleccionado()
        }
      } catch (err) {
        setError('Error al seleccionar usuario')
      }
    }
  }

  const handleVerificarPin = async (e) => {
    e.preventDefault()
    setError('')

    if (pinIngresado.length !== 4) {
      setError('El PIN debe tener 4 dígitos')
      return
    }

    const esValido = await userService.verificarPin(usuarioSeleccionado.id, pinIngresado)
    
    if (esValido) {
      if (modoVerificacion === 'login') {
        // Modo login: entrar al perfil
        try {
          await userService.establecerUsuarioActual(usuarioSeleccionado.id)
          if (onUsuarioSeleccionado) {
            await onUsuarioSeleccionado()
          }
        } catch (err) {
          setError('Error al seleccionar usuario')
        }
      } else if (modoVerificacion === 'eliminar') {
        // Modo eliminar: eliminar el perfil
        try {
          await userService.eliminarUsuario(usuarioSeleccionado.id)
          await cargarUsuarios()
          setVerificandoPin(false)
          setUsuarioSeleccionado(null)
          setPinIngresado('')
        } catch (err) {
          setError('Error al eliminar usuario')
        }
      }
    } else {
      setError('PIN incorrecto')
      setPinIngresado('')
    }
  }

  const handleCrearUsuario = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')

    if (!nuevoNombre.trim()) {
      setError('El nombre es requerido')
      return
    }

    // Validar PIN si se ingresó
    if (nuevoPin && nuevoPin.length !== 4) {
      setError('El PIN debe tener 4 dígitos')
      return
    }

    if (nuevoPin && nuevoPin !== confirmarPin) {
      setError('Los PINs no coinciden')
      return
    }

    setCreando(true)
    try {
      const nuevoUsuario = await userService.crearUsuario(
        nuevoNombre, 
        avatarSeleccionado, 
        nuevoPin || null
      )
      setExito(`¡Perfil "${nuevoUsuario.nombre}" creado exitosamente!`)
      
      // Establecer usuario y recargar
      await userService.establecerUsuarioActual(nuevoUsuario.id)
      
      if (onUsuarioSeleccionado) {
        await onUsuarioSeleccionado()
      }
    } catch (err) {
      setError(err.message || 'Error creando usuario')
      setCreando(false)
    }
  }

  const handleEliminarUsuario = async (userId, e) => {
    e.stopPropagation()
    
    // Buscar el usuario
    const usuario = usuarios.find(u => u.id === userId)
    
    // Si tiene PIN, pedir verificación
    if (usuario?.pin) {
      setUsuarioSeleccionado(usuario)
      setVerificandoPin(true)
      setModoVerificacion('eliminar')
      setPinIngresado('')
      setError('')
    } else {
      // Sin PIN, mostrar modal de confirmación
      setUsuarioAEliminar(usuario)
      setMostrarModalEliminar(true)
    }
  }

  const confirmarEliminacion = async () => {
    try {
      await userService.eliminarUsuario(usuarioAEliminar.id)
      await cargarUsuarios()
      setMostrarModalEliminar(false)
      setUsuarioAEliminar(null)
    } catch (err) {
      setError('Error al eliminar usuario')
      setMostrarModalEliminar(false)
    }
  }

  if (loading) {
    return (
      <div className="user-selector">
        <div className="loading">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="user-selector">
      <div className="user-selector-content">
        <div className="user-selector-header">
          <h1>💪 GymApp</h1>
          <p>Selecciona tu perfil o crea uno nuevo</p>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {exito && (
          <div className="success-message">{exito}</div>
        )}

        {verificandoPin ? (
          <form className="formulario-pin" onSubmit={handleVerificarPin}>
            <div className="pin-header">
              <span className="pin-avatar">{usuarioSeleccionado.avatar}</span>
              <h3>{usuarioSeleccionado.nombre}</h3>
              <p>
                {modoVerificacion === 'login' 
                  ? 'Ingresa tu PIN de 4 dígitos' 
                  : '⚠️ Ingresa tu PIN para confirmar la eliminación'}
              </p>
            </div>
            
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              className="pin-input"
              value={pinIngresado}
              onChange={(e) => setPinIngresado(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              autoFocus
            />

            <div className="pin-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setVerificandoPin(false)
                  setUsuarioSeleccionado(null)
                  setPinIngresado('')
                  setError('')
                  setModoVerificacion('login')
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className={`btn ${modoVerificacion === 'eliminar' ? 'btn-danger' : 'btn-primary'}`}
              >
                {modoVerificacion === 'eliminar' ? 'Eliminar' : 'Confirmar'}
              </button>
            </div>
          </form>
        ) : !mostrarFormulario ? (
          <>
            <div className="usuarios-lista">
              {usuarios.map(usuario => (
                <div key={usuario.id} className="usuario-card-wrapper">
                  <button
                    className="usuario-card"
                    onClick={() => handleSeleccionarUsuario(usuario)}
                  >
                    <span className="usuario-avatar">{usuario.avatar}</span>
                    <div className="usuario-info">
                      <span className="usuario-nombre">{usuario.nombre}</span>
                      {usuario.pin && <span className="usuario-pin-badge">🔒</span>}
                    </div>
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={(e) => handleEliminarUsuario(usuario.id, e)}
                    title="Eliminar perfil"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary btn-large"
              onClick={() => setMostrarFormulario(true)}
            >
              + Crear Nuevo Perfil
            </button>
          </>
        ) : (
          <form className="formulario-usuario" onSubmit={handleCrearUsuario}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                className="form-input"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Tu nombre"
                maxLength={20}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>PIN de seguridad (opcional)</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                className="form-input"
                value={nuevoPin}
                onChange={(e) => setNuevoPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4 dígitos (opcional)"
              />
              {nuevoPin && (
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  className="form-input"
                  style={{ marginTop: '0.375rem' }}
                  value={confirmarPin}
                  onChange={(e) => setConfirmarPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Confirma tu PIN"
                />
              )}
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.125rem', display: 'block' }}>
                Protege tu perfil con un PIN de 4 dígitos
              </small>
            </div>

            <div className="form-group">
              <label>Elige tu avatar</label>
              <div className="avatares-grid">
                {AVATARES.map(avatar => (
                  <button
                    key={avatar}
                    type="button"
                    className={`avatar-option ${avatarSeleccionado === avatar ? 'selected' : ''}`}
                    onClick={() => setAvatarSeleccionado(avatar)}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setMostrarFormulario(false)
                  setError('')
                  setExito('')
                  setNuevoNombre('')
                  setNuevoPin('')
                  setConfirmarPin('')
                  setAvatarSeleccionado('👤')
                }}
                disabled={creando}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={creando}>
                {creando ? '⏳ Creando...' : 'Crear Perfil'}
              </button>
            </div>
          </form>
        )}

        {/* Modal de confirmación para eliminar perfil sin PIN */}
        {mostrarModalEliminar && (
          <div className="modal-overlay" onClick={() => setMostrarModalEliminar(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>⚠️ Eliminar Perfil</h3>
              <p>¿Estás seguro de eliminar el perfil de <strong>{usuarioAEliminar?.nombre}</strong>?</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Se perderán todos los datos de entrenamientos y rutinas.
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setMostrarModalEliminar(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmarEliminacion}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
