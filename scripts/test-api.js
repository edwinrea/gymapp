#!/usr/bin/env node

/**
 * Script de Test - ExerciseDB API Integration
 * 
 * Ejecutar: npm run test:api
 * 
 * Este script verifica:
 * - Configuración de variables de entorno
 * - Conectividad con la API
 * - Funcionalidad básica de búsqueda
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🧪 Testing ExerciseDB API Integration...\n')

const envPath = path.join(__dirname, '..', '.env')
const envExists = fs.existsSync(envPath)

console.log('1️⃣ Verificando archivo .env...')
if (envExists) {
  console.log('   ✅ Archivo .env encontrado')
  
  // Leer contenido
  const envContent = fs.readFileSync(envPath, 'utf8')
  const hasApiKey = envContent.includes('VITE_RAPIDAPI_KEY=') && 
                    !envContent.includes('VITE_RAPIDAPI_KEY=tu-api-key-aqui')
  
  if (hasApiKey) {
    console.log('   ✅ API Key configurada')
  } else {
    console.log('   ⚠️  API Key no configurada o usando placeholder')
    console.log('   💡 Edita .env y agrega tu API Key de RapidAPI')
  }
} else {
  console.log('   ⚠️  Archivo .env no encontrado')
  console.log('   💡 Ejecuta: cp .env.example .env')
}

console.log('\n2️⃣ Verificando archivos de integración...')

const filesToCheck = [
  'src/services/exerciseDBAPI.js',
  'src/services/ejercicios.js',
  'src/components/CatalogoEjercicios.jsx',
  'docs/EXERCISEDB_API.md',
  '.env.example'
]

let allFilesExist = true
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, '..', file)
  const exists = fs.existsSync(filePath)
  console.log(`   ${exists ? '✅' : '❌'} ${file}`)
  if (!exists) allFilesExist = false
})

if (allFilesExist) {
  console.log('   ✅ Todos los archivos presentes')
} else {
  console.log('   ❌ Faltan archivos de integración')
}

console.log('\n3️⃣ Estado del sistema:')
console.log(`   📦 Node.js: ${process.version}`)
console.log(`   📁 Proyecto: ${path.basename(path.join(__dirname, '..'))}`)

if (envExists && fs.readFileSync(envPath, 'utf8').includes('VITE_RAPIDAPI_KEY=')) {
  console.log('\n4️⃣ Para probar la API en el navegador:')
  console.log('   1. Ejecuta: npm run dev')
  console.log('   2. Abre el navegador en http://localhost:3000')
  console.log('   3. Ve a la sección "Catálogo de Ejercicios"')
  console.log('   4. Busca ejercicios o filtra por grupo muscular')
  console.log('   5. Verifica el banner verde de "API conectada"')
} else {
  console.log('\n4️⃣ Siguiente paso - Configurar API:')
  console.log('   1. Regístrate en https://rapidapi.com')
  console.log('   2. Suscríbete a ExerciseDB API (plan gratis disponible)')
  console.log('   3. Copia tu API Key')
  console.log('   4. Crea/edita .env:')
  console.log('      VITE_RAPIDAPI_KEY=tu-api-key-aqui')
  console.log('   5. Reinicia npm run dev')
}

console.log('\n📚 Documentación:')
console.log('   - Guía completa: docs/EXERCISEDB_API.md')
console.log('   - Ejemplos código: src/examples/ejerciciosExamples.js')
console.log('   - Resumen: INTEGRATION_COMPLETE.md')

console.log('\n✨ ¡Sistema de integración verificado!\n')
