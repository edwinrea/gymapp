import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { userService } from '../services/userService'
import ConfirmModal from './ConfirmModal'
import './Layout.css'

export default function Layout({ usuario, onCambiarUsuario }) {
  const location = useLocation()
  const [mostrarModal, setMostrarModal] = useState(false)

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  const handleCerrarSesion = async () => {
    await userService.cerrarSesion()
    onCambiarUsuario()
    setMostrarModal(false)
  }

  return (
    <div className="layout">
      <header className="header">
        <h1>💪 GymApp</h1>
        <button className="user-btn" onClick={() => setMostrarModal(true)} title="Cambiar usuario">
          <span className="user-avatar">{usuario.avatar}</span>
          <span className="user-name">{usuario.nombre}</span>
        </button>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <Link to="/" className={`nav-item ${isActive('/')}`}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Inicio</span>
        </Link>
        <Link to="/rutinas" className={`nav-item ${isActive('/rutinas')}`}>
          <span className="nav-icon">📋</span>
          <span className="nav-label">Rutinas</span>
        </Link>
        <Link to="/historial" className={`nav-item ${isActive('/historial')}`}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">Historial</span>
        </Link>
      </nav>

      <ConfirmModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onConfirm={handleCerrarSesion}
        title="Cambiar de usuario"
        message="¿Deseas cerrar sesión y cambiar de usuario? Podrás volver a entrar cuando quieras."
      />
    </div>
  )
}
