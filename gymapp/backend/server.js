const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const Database = require('better-sqlite3')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL || 'http://localhost:8090')
    : ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8090', 'http://localhost:5173', 'http://192.168.1.39:8080', 'http://192.168.1.39:8081']
}))
app.use(express.json({ limit: '10mb' }))

// Base de datos SQLite
const dbPath = path.join(__dirname, 'data', 'gymapp.db')
const db = new Database(dbPath)

// Crear tablas si no existen
try {
  // Tabla de usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      avatar TEXT NOT NULL DEFAULT '👤',
      pin TEXT NULL,
      fecha_creacion TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tabla de sesiones (usuario actual)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)

  // Tabla de entrenamientos
  db.exec(`
    CREATE TABLE IF NOT EXISTS entrenamientos (
      id INTEGER PRIMARY KEY,
      user_id TEXT NOT NULL,
      fecha TEXT NOT NULL,
      ejercicios TEXT NOT NULL, -- JSON
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)

  // Tabla de rutinas activas
  db.exec(`
    CREATE TABLE IF NOT EXISTS rutinas_activas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      rutina_data TEXT NOT NULL, -- JSON
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)

  // Tabla de historial de rutinas
  db.exec(`
    CREATE TABLE IF NOT EXISTS rutinas_historial (
      id INTEGER PRIMARY KEY,
      user_id TEXT NOT NULL,
      rutina_data TEXT NOT NULL, -- JSON
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)
  
  console.log('✅ Tablas de base de datos inicializadas')
} catch (error) {
  console.error('❌ Error inicializando base de datos:', error)
  process.exit(1)
}

// =============================================================================
// USUARIOS
// =============================================================================

// Obtener todos los usuarios
app.get('/api/users', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, nombre, avatar, pin, fecha_creacion FROM users ORDER BY created_at DESC')
    const rows = stmt.all()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Crear usuario
app.post('/api/users', (req, res) => {
  const { id, nombre, avatar, pin, fechaCreacion } = req.body
  
  if (!id || !nombre) {
    return res.status(400).json({ error: 'ID y nombre son requeridos' })
  }

  try {
    const stmt = db.prepare('INSERT INTO users (id, nombre, avatar, pin, fecha_creacion) VALUES (?, ?, ?, ?, ?)')
    stmt.run(id, nombre, avatar || '👤', pin || null, fechaCreacion || new Date().toISOString())
    res.json({ id, nombre, avatar: avatar || '👤', pin: pin || null, fechaCreacion })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Eliminar usuario
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params
  
  try {
    // Eliminar datos relacionados en transacción
    const deleteTransaction = db.transaction(() => {
      db.prepare('DELETE FROM entrenamientos WHERE user_id = ?').run(id)
      db.prepare('DELETE FROM rutinas_activas WHERE user_id = ?').run(id)
      db.prepare('DELETE FROM rutinas_historial WHERE user_id = ?').run(id)
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(id)
      const result = db.prepare('DELETE FROM users WHERE id = ?').run(id)
      return result.changes
    })
    
    const changes = deleteTransaction()
    res.json({ message: 'Usuario eliminado', changes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================================================================
// SESIONES
// =============================================================================

// Obtener sesión actual
app.get('/api/session', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT u.id, u.nombre, u.avatar, u.pin, u.fecha_creacion 
      FROM sessions s 
      JOIN users u ON s.user_id = u.id 
      ORDER BY s.created_at DESC 
      LIMIT 1
    `)
    const row = stmt.get()
    res.json(row || null)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Establecer sesión actual
app.post('/api/session', (req, res) => {
  const { userId } = req.body
  
  if (!userId) {
    return res.status(400).json({ error: 'userId es requerido' })
  }

  try {
    // Limpiar sesiones anteriores e insertar nueva en transacción
    const sessionTransaction = db.transaction(() => {
      db.prepare('DELETE FROM sessions').run()
      db.prepare('INSERT INTO sessions (user_id) VALUES (?)').run(userId)
    })
    
    sessionTransaction()
    res.json({ message: 'Sesión establecida', userId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Cerrar sesión
app.delete('/api/session', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM sessions')
    stmt.run()
    res.json({ message: 'Sesión cerrada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================================================================
// ENTRENAMIENTOS
// =============================================================================

// Obtener entrenamientos de un usuario
app.get('/api/entrenamientos/:userId', (req, res) => {
  const { userId } = req.params
  
  try {
    const stmt = db.prepare('SELECT id, fecha, ejercicios FROM entrenamientos WHERE user_id = ? ORDER BY fecha DESC')
    const rows = stmt.all(userId)
    
    const entrenamientos = rows.map(row => ({
      ...row,
      ejercicios: JSON.parse(row.ejercicios)
    }))
    
    res.json(entrenamientos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Obtener entrenamiento específico
app.get('/api/entrenamientos/:userId/:id', (req, res) => {
  const { userId, id } = req.params
  
  try {
    const stmt = db.prepare('SELECT id, fecha, ejercicios FROM entrenamientos WHERE user_id = ? AND id = ?')
    const row = stmt.get(userId, id)
    
    if (!row) {
      return res.status(404).json({ error: 'Entrenamiento no encontrado' })
    }
    
    res.json({
      ...row,
      ejercicios: JSON.parse(row.ejercicios)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Crear o actualizar entrenamiento
app.post('/api/entrenamientos/:userId', (req, res) => {
  const { userId } = req.params
  const { id, fecha, ejercicios } = req.body
  
  if (!id || !fecha || !ejercicios) {
    return res.status(400).json({ error: 'id, fecha y ejercicios son requeridos' })
  }

  try {
    const stmt = db.prepare('INSERT OR REPLACE INTO entrenamientos (id, user_id, fecha, ejercicios) VALUES (?, ?, ?, ?)')
    stmt.run(id, userId, fecha, JSON.stringify(ejercicios))
    res.json({ id, fecha, ejercicios })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Eliminar entrenamiento
app.delete('/api/entrenamientos/:userId/:id', (req, res) => {
  const { userId, id } = req.params
  
  try {
    const stmt = db.prepare('DELETE FROM entrenamientos WHERE user_id = ? AND id = ?')
    const result = stmt.run(userId, id)
    res.json({ message: 'Entrenamiento eliminado', changes: result.changes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================================================================
// RUTINAS
// =============================================================================

// Obtener rutina activa
app.get('/api/rutina-activa/:userId', (req, res) => {
  const { userId } = req.params
  
  try {
    const stmt = db.prepare('SELECT rutina_data FROM rutinas_activas WHERE user_id = ?')
    const row = stmt.get(userId)
    
    if (!row) {
      return res.json(null)
    }
    
    res.json(JSON.parse(row.rutina_data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Guardar rutina activa
app.put('/api/rutina-activa/:userId', (req, res) => {
  const { userId } = req.params
  const rutinaData = req.body
  
  if (!rutinaData) {
    return res.status(400).json({ error: 'Datos de rutina son requeridos' })
  }

  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO rutinas_activas (user_id, rutina_data, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `)
    stmt.run(userId, JSON.stringify(rutinaData))
    res.json(rutinaData)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Eliminar rutina activa
app.delete('/api/rutina-activa/:userId', (req, res) => {
  const { userId } = req.params
  
  try {
    const stmt = db.prepare('DELETE FROM rutinas_activas WHERE user_id = ?')
    const result = stmt.run(userId)
    res.json({ message: 'Rutina activa eliminada', changes: result.changes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Algo salió mal!' })
})

// Crear directorio de datos si no existe
const fs = require('fs')
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`)
  console.log(`📁 Base de datos: ${dbPath}`)
})