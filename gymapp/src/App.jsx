import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Historial from './components/Historial'
import DetalleEntrenamiento from './components/DetalleEntrenamiento'
import Rutinas from './components/Rutinas'
import GeneradorRutinas from './components/GeneradorRutinas'
import RutinaDia from './components/RutinaDia'
import CatalogoEjercicios from './components/CatalogoEjercicios'
import UserSelector from './components/UserSelector'
import MigrationPanel from './components/MigrationPanel'
import { userService } from './services/userService'

function App() {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarUsuario()
  }, [])

  const cargarUsuario = async () => {
    const user = await userService.obtenerUsuarioActual()
    setUsuario(user)
    setLoading(false)
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  }

  if (!usuario) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<UserSelector onUsuarioSeleccionado={cargarUsuario} />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout usuario={usuario} onCambiarUsuario={() => { setUsuario(null) }} />}>
            <Route index element={<Home />} />
            <Route path="historial" element={<Historial />} />
            <Route path="entrenamiento/:id" element={<DetalleEntrenamiento />} />
            <Route path="rutinas" element={<Rutinas />} />
            <Route path="generar-rutina" element={<GeneradorRutinas />} />
            <Route path="rutina-dia/:indiceDia" element={<RutinaDia />} />
            <Route path="catalogo-ejercicios" element={<CatalogoEjercicios />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      
      {/* Panel de migración - solo aparece si hay datos legacy */}
      <MigrationPanel />
    </>
  )
}

export default App
