import exerciseDBAPI from './exerciseDBAPI'

// Catálogo de ejercicios con información completa
// 
// NOTA: Este catálogo LOCAL sirve como fallback y para búsqueda rápida offline.
// Para videos/imágenes/ejercicios adicionales, se usa la API de ExerciseDB.
// 
// INTEGRACIÓN HÍBRIDA:
// - Catálogo local: 15+ ejercicios básicos, disponible offline
// - ExerciseDB API: +11,000 ejercicios con videos/imágenes (requiere conexión)
// - El sistema busca primero en local, luego en API si está configurada
//
export const ejerciciosDB = [
  // PECHO
  {
    id: 'press-banca',
    nombre: 'Press de Banca',
    grupoMuscular: 'pecho',
    gruposSecundarios: ['triceps', 'hombros'],
    dificultad: 'intermedio',
    equipamiento: 'barra',
    descripcion: 'Ejercicio compuesto fundamental para desarrollo de pecho',
    video: 'https://www.youtube.com/watch?v=gRVjAtPip0Y',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif',
    instrucciones: [
      'Acuéstate en el banco con los pies firmes en el suelo',
      'Agarra la barra con las manos un poco más anchas que los hombros',
      'Baja la barra controladamente hasta el pecho',
      'Empuja hacia arriba hasta extensión completa'
    ],
    seriesRecomendadas: { min: 3, max: 5 },
    repeticionesRecomendadas: { min: 6, max: 12 }
  },
  {
    id: 'press-inclinado',
    nombre: 'Press Inclinado',
    grupoMuscular: 'pecho',
    gruposSecundarios: ['hombros', 'triceps'],
    dificultad: 'intermedio',
    equipamiento: 'barra',
    descripcion: 'Enfatiza la parte superior del pecho',
    video: 'https://www.youtube.com/watch?v=SrqOu55lrYU',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Barbell-Bench-Press.gif',
    instrucciones: [
      'Ajusta el banco a 30-45 grados',
      'Sigue la técnica del press de banca plano'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 8, max: 12 }
  },
  {
    id: 'aperturas-mancuernas',
    nombre: 'Aperturas con Mancuernas',
    grupoMuscular: 'pecho',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'mancuernas',
    descripcion: 'Estiramiento y contracción del pecho',
    video: 'https://www.youtube.com/watch?v=eozdVDA78K0',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgNDAwIDMwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQtRUY0NDQ0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0VGNDQ0NDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREMyNjI2O3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZC1FRjQ0NDQpIi8+CiAgPHRleHQgeD0iMjAwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjk1Ij7irIbvuI88L3RleHQ+CiAgPHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9IjYwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOTUiPkVsZXZhY2lvbmVzIEZyb250YWxlczwvdGV4dD4KPC9zdmc+',
    instrucciones: [
      'Acostado en banco, brazos extendidos sobre el pecho',
      'Baja los brazos en arco manteniendo codos ligeramente flexionados',
      'Vuelve a la posición inicial contrayendo el pecho'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 10, max: 15 }
  },
  
  // ESPALDA
  {
    id: 'dominadas',
    nombre: 'Dominadas',
    grupoMuscular: 'espalda',
    gruposSecundarios: ['biceps'],
    dificultad: 'avanzado',
    equipamiento: 'barra-fija',
    descripcion: 'Ejercicio fundamental para desarrollo de espalda',
    video: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
    instrucciones: [
      'Agarra la barra con las manos más anchas que los hombros',
      'Cuelga con brazos extendidos',
      'Sube hasta que la barbilla pase la barra',
      'Baja controladamente'
    ],
    seriesRecomendadas: { min: 3, max: 5 },
    repeticionesRecomendadas: { min: 5, max: 12 }
  },
  {
    id: 'remo-barra',
    nombre: 'Remo con Barra',
    grupoMuscular: 'espalda',
    gruposSecundarios: ['biceps', 'core'],
    dificultad: 'intermedio',
    equipamiento: 'barra',
    descripcion: 'Desarrollo de grosor de la espalda',
    video: 'https://www.youtube.com/watch?v=kBWAon7ItDw',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif',
    instrucciones: [
      'Inclínate hacia adelante con espalda recta',
      'Agarra la barra con agarre pronado',
      'Lleva la barra hacia el abdomen bajo',
      'Contrae los omóplatos en la parte superior'
    ],
    seriesRecomendadas: { min: 3, max: 5 },
    repeticionesRecomendadas: { min: 6, max: 10 }
  },
  {
    id: 'peso-muerto',
    nombre: 'Peso Muerto',
    grupoMuscular: 'espalda',
    gruposSecundarios: ['piernas', 'core'],
    dificultad: 'avanzado',
    equipamiento: 'barra',
    descripcion: 'Ejercicio compuesto completo, rey de la espalda baja',
    video: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif',
    instrucciones: [
      'Pies al ancho de caderas, barra sobre los pies',
      'Agarra la barra con espalda recta',
      'Empuja con las piernas y extiende caderas',
      'Mantén la barra cerca del cuerpo'
    ],
    seriesRecomendadas: { min: 3, max: 5 },
    repeticionesRecomendadas: { min: 3, max: 8 }
  },

  // PIERNAS
  {
    id: 'sentadilla',
    nombre: 'Sentadilla',
    grupoMuscular: 'piernas',
    gruposSecundarios: ['core', 'gluteos'],
    dificultad: 'intermedio',
    equipamiento: 'barra',
    descripcion: 'Rey de los ejercicios de pierna',
    video: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif',
    instrucciones: [
      'Barra en la parte superior de la espalda',
      'Pies al ancho de hombros',
      'Baja hasta que muslos estén paralelos al suelo',
      'Empuja con los talones para subir'
    ],
    seriesRecomendadas: { min: 3, max: 5 },
    repeticionesRecomendadas: { min: 6, max: 12 }
  },
  {
    id: 'prensa-pierna',
    nombre: 'Prensa de Pierna',
    grupoMuscular: 'piernas',
    gruposSecundarios: ['gluteos'],
    dificultad: 'principiante',
    equipamiento: 'maquina',
    descripcion: 'Ejercicio seguro para cuádriceps y glúteos',
    video: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/LEG-PRESS.gif',
    instrucciones: [
      'Coloca los pies al ancho de hombros en la plataforma',
      'Baja la plataforma controladamente',
      'Empuja sin bloquear completamente las rodillas'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 8, max: 15 }
  },
  {
    id: 'curl-femoral',
    nombre: 'Curl Femoral',
    grupoMuscular: 'piernas',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'maquina',
    descripcion: 'Aislamiento de isquiotibiales',
    video: 'https://www.youtube.com/watch?v=ELOCsoDSmrg',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/leg-curl.gif',
    instrucciones: [
      'Acuéstate boca abajo en la máquina',
      'Coloca los tobillos bajo los rodillos',
      'Flexiona las piernas llevando los talones hacia los glúteos'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 10, max: 15 }
  },

  // HOMBROS
  {
    id: 'press-militar',
    nombre: 'Press Militar',
    grupoMuscular: 'hombros',
    gruposSecundarios: ['triceps', 'core'],
    dificultad: 'intermedio',
    equipamiento: 'barra',
    descripcion: 'Desarrollo de hombros de pie',
    video: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/barbell-standing-military-press.gif',
    instrucciones: [
      'De pie con barra a la altura de los hombros',
      'Empuja hacia arriba hasta extensión completa',
      'Baja controladamente a la posición inicial'
    ],
    seriesRecomendadas: { min: 3, max: 5 },
    repeticionesRecomendadas: { min: 6, max: 10 }
  },
  {
    id: 'elevaciones-laterales',
    nombre: 'Elevaciones Laterales',
    grupoMuscular: 'hombros',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'mancuernas',
    descripcion: 'Aislamiento del deltoides lateral',
    video: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif',
    instrucciones: [
      'De pie con mancuernas a los lados',
      'Eleva los brazos lateralmente hasta la altura de los hombros',
      'Baja controladamente'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 12, max: 15 }
  },

  // BRAZOS
  {
    id: 'curl-barra',
    nombre: 'Curl con Barra',
    grupoMuscular: 'biceps',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'barra',
    descripcion: 'Ejercicio básico para bíceps',
    video: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
    instrucciones: [
      'De pie con barra en las manos, agarre supino',
      'Flexiona los codos llevando la barra hacia los hombros',
      'Mantén los codos pegados al cuerpo'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 8, max: 12 }
  },
  {
    id: 'press-frances',
    nombre: 'Press Francés',
    grupoMuscular: 'triceps',
    gruposSecundarios: [],
    dificultad: 'intermedio',
    equipamiento: 'barra',
    descripcion: 'Aislamiento de tríceps',
    video: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Lying-Triceps-Extension.gif',
    instrucciones: [
      'Acostado, barra sobre la frente con brazos extendidos',
      'Baja la barra flexionando solo los codos',
      'Extiende los brazos de vuelta'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 8, max: 12 }
  },

  // MÁS PECHO
  {
    id: 'press-mancuernas',
    nombre: 'Press con Mancuernas',
    grupoMuscular: 'pecho',
    gruposSecundarios: ['hombros', 'triceps'],
    dificultad: 'intermedio',
    equipamiento: 'mancuernas',
    descripcion: 'Mayor rango de movimiento que con barra',
    video: 'https://www.youtube.com/watch?v=VmB1G1K7v94',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif',
    instrucciones: [
      'Acuéstate en banco con mancuernas a los lados del pecho',
      'Empuja hacia arriba hasta extensión completa',
      'Baja controladamente'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 8, max: 12 }
  },
  {
    id: 'fondos-paralelas',
    nombre: 'Fondos en Paralelas',
    grupoMuscular: 'pecho',
    gruposSecundarios: ['triceps', 'hombros'],
    dificultad: 'intermedio',
    equipamiento: 'peso-corporal',
    descripcion: 'Ejercicio compuesto para pecho inferior',
    video: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Dips.gif',
    instrucciones: [
      'Agarra las barras paralelas',
      'Inclínate hacia adelante',
      'Baja hasta que codos estén a 90 grados',
      'Empuja hacia arriba'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 8, max: 15 }
  },
  {
    id: 'cruce-poleas',
    nombre: 'Cruces en Poleas',
    grupoMuscular: 'pecho',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'maquina',
    descripcion: 'Aislamiento y definición del pecho',
    video: 'https://www.youtube.com/watch?v=taI4XduLpTk',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/standing-cable-chest-fly.gif',
    instrucciones: [
      'De pie entre las poleas',
      'Cruza los brazos frente al pecho',
      'Mantén ligera flexión en codos'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 12, max: 15 }
  },

  // MÁS ESPALDA
  {
    id: 'pull-down',
    nombre: 'Jalón al Pecho',
    grupoMuscular: 'espalda',
    gruposSecundarios: ['biceps'],
    dificultad: 'principiante',
    equipamiento: 'maquina',
    descripcion: 'Alternativa a dominadas para principiantes',
    video: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/LAT-PULL-DOWN.gif',
    instrucciones: [
      'Sentado, agarra la barra con agarre amplio',
      'Tira hacia el pecho',
      'Contrae los omóplatos'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 8, max: 12 }
  },
  {
    id: 'remo-mancuerna',
    nombre: 'Remo con Mancuerna',
    grupoMuscular: 'espalda',
    gruposSecundarios: ['biceps'],
    dificultad: 'intermedio',
    equipamiento: 'mancuernas',
    descripcion: 'Trabajo unilateral de espalda',
    video: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif',
    instrucciones: [
      'Apoya rodilla y mano en banco',
      'Tira mancuerna hacia cadera',
      'Mantén espalda recta'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 8, max: 12 }
  },
  {
    id: 'pull-over',
    nombre: 'Pull Over con Mancuerna',
    grupoMuscular: 'espalda',
    gruposSecundarios: ['pecho'],
    dificultad: 'intermedio',
    equipamiento: 'mancuernas',
    descripcion: 'Expansión de caja torácica',
    video: 'https://www.youtube.com/watch?v=FK0S723bjZQ',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Pullover.gif',
    instrucciones: [
      'Acostado transversal en banco',
      'Mancuerna sobre el pecho',
      'Baja en arco detrás de la cabeza'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 10, max: 15 }
  },

  // MÁS PIERNAS
  {
    id: 'zancadas',
    nombre: 'Zancadas',
    grupoMuscular: 'piernas',
    gruposSecundarios: ['gluteos', 'core'],
    dificultad: 'intermedio',
    equipamiento: 'mancuernas',
    descripcion: 'Trabajo unilateral de piernas',
    video: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif',
    instrucciones: [
      'Da un paso adelante largo',
      'Baja hasta que ambas rodillas estén a 90 grados',
      'Vuelve a posición inicial'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 10, max: 15 }
  },
  {
    id: 'peso-muerto-rumano',
    nombre: 'Peso Muerto Rumano',
    grupoMuscular: 'piernas',
    gruposSecundarios: ['gluteos', 'espalda'],
    dificultad: 'intermedio',
    equipamiento: 'barra',
    descripcion: 'Enfoque en isquiotibiales y glúteos',
    video: 'https://www.youtube.com/watch?v=2SHsk9AzdjA',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Romanian-Deadlift.gif',
    instrucciones: [
      'Barra a la altura de muslos',
      'Baja empujando cadera atrás',
      'Mantén ligera flexión en rodillas'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 8, max: 12 }
  },
  {
    id: 'extension-cuadriceps',
    nombre: 'Extensión de Cuádriceps',
    grupoMuscular: 'piernas',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'maquina',
    descripcion: 'Aislamiento de cuádriceps',
    video: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/LEG-EXTENSION.gif',
    instrucciones: [
      'Sentado en máquina',
      'Extiende piernas hasta casi bloqueo',
      'Baja controladamente'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 12, max: 15 }
  },
  {
    id: 'sentadilla-bulgara',
    nombre: 'Sentadilla Búlgara',
    grupoMuscular: 'piernas',
    gruposSecundarios: ['gluteos'],
    dificultad: 'intermedio',
    equipamiento: 'mancuernas',
    descripcion: 'Sentadilla unilateral en elevación',
    video: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif',
    instrucciones: [
      'Pie trasero elevado en banco',
      'Baja con pierna delantera',
      'Mantén torso erguido'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 10, max: 12 }
  },
  {
    id: 'elevacion-talones',
    nombre: 'Elevación de Talones',
    grupoMuscular: 'piernas',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'maquina',
    descripcion: 'Trabajo de gemelos/pantorrillas',
    video: 'https://www.youtube.com/watch?v=JJ9iCcSzS-I',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Standing-Calf-Raise.gif',
    instrucciones: [
      'De pie con puntas de pies en elevación',
      'Sube sobre las puntas lo más alto posible',
      'Baja hasta estiramiento completo'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 15, max: 20 }
  },

  // MÁS HOMBROS
  {
    id: 'press-arnold',
    nombre: 'Press Arnold',
    grupoMuscular: 'hombros',
    gruposSecundarios: ['triceps'],
    dificultad: 'intermedio',
    equipamiento: 'mancuernas',
    descripcion: 'Variante de press con rotación',
    video: 'https://www.youtube.com/watch?v=6Z15_WdXmVw',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Arnold-Dumbbell-Press.gif',
    instrucciones: [
      'Sentado, mancuernas a altura de hombros palmas hacia ti',
      'Rota palmas hacia adelante mientras empujas',
      'Extiende completamente arriba'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 8, max: 12 }
  },
  {
    id: 'elevaciones-frontales',
    nombre: 'Elevaciones Frontales',
    grupoMuscular: 'hombros',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'mancuernas',
    descripcion: 'Aislamiento deltoides frontal',
    video: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Front-Raise.gif',
    instrucciones: [
      'De pie, mancuernas frente a muslos',
      'Eleva brazos adelante hasta altura de hombros',
      'Baja controladamente'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 12, max: 15 }
  },
  {
    id: 'pajaros',
    nombre: 'Pájaros (Deltoides Posterior)',
    grupoMuscular: 'hombros',
    gruposSecundarios: ['espalda'],
    dificultad: 'intermedio',
    equipamiento: 'mancuernas',
    descripcion: 'Aislamiento de deltoides posterior',
    video: 'https://www.youtube.com/watch?v=ttvfGg9d76c',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Rear-Delt-Row-2.gif',
    instrucciones: [
      'Inclinado hacia adelante',
      'Abre brazos lateralmente',
      'Aprieta omóplatos'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 12, max: 15 }
  },

  // MÁS BRAZOS
  {
    id: 'curl-martillo',
    nombre: 'Curl Martillo',
    grupoMuscular: 'biceps',
    gruposSecundarios: ['antebrazos'],
    dificultad: 'principiante',
    equipamiento: 'mancuernas',
    descripcion: 'Trabajo de bíceps y braquial',
    video: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
    instrucciones: [
      'De pie, mancuernas con agarre neutro',
      'Flexiona codos manteniendo palmas enfrentadas',
      'Contrae bíceps arriba'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 10, max: 12 }
  },
  {
    id: 'curl-concentrado',
    nombre: 'Curl Concentrado',
    grupoMuscular: 'biceps',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'mancuernas',
    descripcion: 'Aislamiento máximo de bíceps',
    video: 'https://www.youtube.com/watch?v=Jvj2wV0vOdg',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Concentration-Curl.gif',
    instrucciones: [
      'Sentado, codo apoyado en muslo',
      'Flexiona brazo hacia hombro',
      'Concéntrate en la contracción'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 10, max: 12 }
  },
  {
    id: 'fondos-banco',
    nombre: 'Fondos en Banco',
    grupoMuscular: 'triceps',
    gruposSecundarios: ['hombros'],
    dificultad: 'principiante',
    equipamiento: 'peso-corporal',
    descripcion: 'Ejercicio de tríceps con peso corporal',
    video: 'https://www.youtube.com/watch?v=0326dy_-CzM',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bench-Dips.gif',
    instrucciones: [
      'Manos en borde de banco detrás de ti',
      'Baja flexionando codos',
      'Empuja hacia arriba'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 12, max: 15 }
  },
  {
    id: 'extension-polea',
    nombre: 'Extensión en Polea',
    grupoMuscular: 'triceps',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'maquina',
    descripcion: 'Aislamiento de tríceps en cable',
    video: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif',
    instrucciones: [
      'De pie frente a polea alta',
      'Extiende brazos hacia abajo',
      'Mantén codos pegados'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 12, max: 15 }
  },

  // CORE/ABDOMEN
  {
    id: 'plancha',
    nombre: 'Plancha',
    grupoMuscular: 'core',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'peso-corporal',
    descripcion: 'Ejercicio isométrico de core',
    video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif',
    instrucciones: [
      'Apoya antebrazos y puntas de pies',
      'Mantén cuerpo recto',
      'Aguanta posición'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 30, max: 60 } // segundos
  },
  {
    id: 'abdominales',
    nombre: 'Abdominales Crunch',
    grupoMuscular: 'core',
    gruposSecundarios: [],
    dificultad: 'principiante',
    equipamiento: 'peso-corporal',
    descripcion: 'Ejercicio básico de abdomen',
    video: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif',
    instrucciones: [
      'Acostado boca arriba, rodillas flexionadas',
      'Levanta hombros del suelo',
      'Contrae abdomen'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 15, max: 25 }
  },
  {
    id: 'elevacion-piernas',
    nombre: 'Elevación de Piernas',
    grupoMuscular: 'core',
    gruposSecundarios: [],
    dificultad: 'intermedio',
    equipamiento: 'peso-corporal',
    descripcion: 'Trabajo de abdomen inferior',
    video: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Leg-raise.gif',
    instrucciones: [
      'Acostado boca arriba',
      'Eleva piernas rectas hasta 90 grados',
      'Baja sin tocar el suelo'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 12, max: 20 }
  },
  {
    id: 'russian-twist',
    nombre: 'Russian Twist',
    grupoMuscular: 'core',
    gruposSecundarios: ['oblicuos'],
    dificultad: 'intermedio',
    equipamiento: 'peso-corporal',
    descripcion: 'Rotación de torso para oblicuos',
    video: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    thumbnail: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Russian-Twist.gif',
    instrucciones: [
      'Sentado, torso inclinado atrás',
      'Gira torso de lado a lado',
      'Puedes sostener peso'
    ],
    seriesRecomendadas: { min: 3, max: 4 },
    repeticionesRecomendadas: { min: 20, max: 30 }
  }
]

// Plantillas de rutinas según objetivos - MEJORADAS
export const rutinasTemplates = {
  // ============ RUTINAS DE FUERZA ============
  'fuerza-3dias': {
    nombre: 'Fuerza Powerlifting - 3 días',
    objetivo: 'fuerza',
    nivel: 'intermedio',
    diasSemana: 3,
    descripcion: 'Programa enfocado en los 3 grandes: sentadilla, press de banca y peso muerto. Ideal para ganar fuerza máxima.',
    dias: [
      {
        nombre: 'Día 1 - Sentadilla Pesada',
        ejercicios: ['sentadilla', 'prensa-pierna', 'curl-femoral', 'press-banca'],
        series: [5, 3, 3, 3],
        reps: [5, 8, 10, 8]
      },
      {
        nombre: 'Día 2 - Press de Banca Pesado',
        ejercicios: ['press-banca', 'press-inclinado', 'press-militar', 'press-frances'],
        series: [5, 4, 3, 3],
        reps: [5, 6, 8, 10]
      },
      {
        nombre: 'Día 3 - Peso Muerto Pesado',
        ejercicios: ['peso-muerto', 'dominadas', 'remo-barra', 'sentadilla'],
        series: [5, 4, 4, 3],
        reps: [5, 6, 8, 8]
      }
    ]
  },
  
  'fuerza-4dias': {
    nombre: 'Fuerza Upper/Lower - 4 días',
    objetivo: 'fuerza',
    nivel: 'avanzado',
    diasSemana: 4,
    descripcion: 'División tren superior/inferior con énfasis en fuerza. Alta frecuencia para máximas ganancias.',
    dias: [
      {
        nombre: 'Día 1 - Tren Superior Pesado',
        ejercicios: ['press-banca', 'remo-barra', 'press-militar', 'dominadas'],
        series: [5, 5, 4, 3],
        reps: [5, 5, 6, 8]
      },
      {
        nombre: 'Día 2 - Tren Inferior Pesado',
        ejercicios: ['sentadilla', 'peso-muerto', 'prensa-pierna', 'curl-femoral'],
        series: [5, 4, 3, 3],
        reps: [5, 5, 10, 12]
      },
      {
        nombre: 'Día 3 - Tren Superior Volumen',
        ejercicios: ['press-inclinado', 'dominadas', 'press-militar', 'curl-barra'],
        series: [4, 4, 4, 3],
        reps: [8, 8, 8, 10]
      },
      {
        nombre: 'Día 4 - Tren Inferior Volumen',
        ejercicios: ['sentadilla', 'prensa-pierna', 'peso-muerto', 'curl-femoral'],
        series: [4, 4, 3, 3],
        reps: [8, 10, 6, 12]
      }
    ]
  },

  // ============ RUTINAS DE HIPERTROFIA ============
  'hipertrofia-3dias': {
    nombre: 'Hipertrofia Full Body - 3 días',
    objetivo: 'hipertrofia',
    nivel: 'intermedio',
    diasSemana: 3,
    descripcion: 'Cuerpo completo 3x/semana para máximo crecimiento muscular con volumen optimizado.',
    dias: [
      {
        nombre: 'Día A - Empuje Dominante',
        ejercicios: ['press-banca', 'sentadilla', 'press-militar', 'remo-barra', 'press-frances'],
        series: [4, 4, 3, 3, 3],
        reps: [8, 10, 10, 10, 12]
      },
      {
        nombre: 'Día B - Tirón Dominante',
        ejercicios: ['peso-muerto', 'dominadas', 'press-inclinado', 'curl-barra', 'elevaciones-laterales'],
        series: [4, 4, 3, 3, 3],
        reps: [8, 8, 10, 12, 15]
      },
      {
        nombre: 'Día C - Piernas Dominante',
        ejercicios: ['sentadilla', 'prensa-pierna', 'curl-femoral', 'press-banca', 'remo-barra'],
        series: [4, 4, 3, 3, 3],
        reps: [10, 12, 12, 10, 10]
      }
    ]
  },

  'hipertrofia-4dias': {
    nombre: 'Hipertrofia Push/Pull/Legs - 4 días',
    objetivo: 'hipertrofia',
    nivel: 'intermedio',
    diasSemana: 4,
    descripcion: 'División empuje/tirón/piernas con día extra de volumen. Perfecto para hipertrofia.',
    dias: [
      {
        nombre: 'Día 1 - Empuje (Pecho, Hombros, Tríceps)',
        ejercicios: ['press-banca', 'press-inclinado', 'press-militar', 'elevaciones-laterales', 'press-frances'],
        series: [4, 4, 4, 3, 3],
        reps: [8, 10, 8, 12, 12]
      },
      {
        nombre: 'Día 2 - Tirón (Espalda, Bíceps)',
        ejercicios: ['peso-muerto', 'dominadas', 'remo-barra', 'curl-barra'],
        series: [4, 4, 4, 3],
        reps: [8, 8, 10, 12]
      },
      {
        nombre: 'Día 3 - Piernas',
        ejercicios: ['sentadilla', 'prensa-pierna', 'curl-femoral', 'peso-muerto'],
        series: [4, 4, 3, 3],
        reps: [10, 12, 12, 8]
      },
      {
        nombre: 'Día 4 - Pecho y Brazos',
        ejercicios: ['press-banca', 'aperturas-mancuernas', 'curl-barra', 'press-frances'],
        series: [4, 3, 4, 4],
        reps: [10, 12, 10, 10]
      }
    ]
  },

  'hipertrofia-5dias': {
    nombre: 'Hipertrofia Bro Split - 5 días',
    objetivo: 'hipertrofia',
    nivel: 'avanzado',
    diasSemana: 5,
    descripcion: 'Un grupo muscular por día. Máximo volumen e intensidad por músculo.',
    dias: [
      {
        nombre: 'Día 1 - Pecho',
        ejercicios: ['press-banca', 'press-inclinado', 'aperturas-mancuernas', 'press-banca'],
        series: [4, 4, 3, 3],
        reps: [8, 10, 12, 12]
      },
      {
        nombre: 'Día 2 - Espalda',
        ejercicios: ['peso-muerto', 'dominadas', 'remo-barra', 'remo-barra'],
        series: [4, 4, 4, 3],
        reps: [6, 8, 10, 12]
      },
      {
        nombre: 'Día 3 - Hombros',
        ejercicios: ['press-militar', 'elevaciones-laterales', 'press-militar', 'elevaciones-laterales'],
        series: [4, 4, 3, 3],
        reps: [8, 12, 10, 15]
      },
      {
        nombre: 'Día 4 - Piernas',
        ejercicios: ['sentadilla', 'prensa-pierna', 'curl-femoral', 'sentadilla'],
        series: [5, 4, 4, 3],
        reps: [8, 10, 12, 15]
      },
      {
        nombre: 'Día 5 - Brazos',
        ejercicios: ['curl-barra', 'press-frances', 'curl-barra', 'press-frances'],
        series: [4, 4, 3, 3],
        reps: [10, 10, 12, 12]
      }
    ]
  },

  // ============ RUTINAS PARA PRINCIPIANTES ============
  'principiante-3dias': {
    nombre: 'Principiante Full Body - 3 días',
    objetivo: 'general',
    nivel: 'principiante',
    diasSemana: 3,
    descripcion: 'Rutina de cuerpo completo perfecta para empezar. Aprende los movimientos básicos con buen volumen.',
    dias: [
      {
        nombre: 'Día A',
        ejercicios: ['sentadilla', 'press-banca', 'remo-barra', 'press-militar', 'curl-barra'],
        series: [3, 3, 3, 3, 2],
        reps: [10, 10, 10, 10, 12]
      },
      {
        nombre: 'Día B',
        ejercicios: ['peso-muerto', 'press-inclinado', 'dominadas', 'elevaciones-laterales', 'press-frances'],
        series: [3, 3, 3, 3, 2],
        reps: [8, 10, 8, 12, 12]
      },
      {
        nombre: 'Día C',
        ejercicios: ['prensa-pierna', 'press-banca', 'remo-barra', 'press-militar', 'curl-barra'],
        series: [3, 3, 3, 3, 2],
        reps: [12, 10, 10, 10, 12]
      }
    ]
  },

  // ============ RUTINAS DE DEFINICIÓN ============
  'definicion-4dias': {
    nombre: 'Definición Muscular - 4 días',
    objetivo: 'definicion',
    nivel: 'intermedio',
    diasSemana: 4,
    descripcion: 'Alto volumen, repeticiones medias-altas. Ideal para mantener músculo mientras defines.',
    dias: [
      {
        nombre: 'Día 1 - Tren Superior Push',
        ejercicios: ['press-banca', 'press-inclinado', 'press-militar', 'elevaciones-laterales', 'press-frances'],
        series: [3, 3, 3, 3, 3],
        reps: [12, 12, 12, 15, 15]
      },
      {
        nombre: 'Día 2 - Tren Inferior',
        ejercicios: ['sentadilla', 'prensa-pierna', 'curl-femoral', 'sentadilla'],
        series: [4, 3, 3, 3],
        reps: [12, 15, 15, 20]
      },
      {
        nombre: 'Día 3 - Tren Superior Pull',
        ejercicios: ['dominadas', 'remo-barra', 'peso-muerto', 'curl-barra'],
        series: [3, 3, 3, 3],
        reps: [12, 12, 10, 15]
      },
      {
        nombre: 'Día 4 - Circuito Full Body',
        ejercicios: ['press-banca', 'dominadas', 'sentadilla', 'press-militar', 'remo-barra'],
        series: [3, 3, 3, 3, 3],
        reps: [15, 12, 15, 12, 12]
      }
    ]
  },

  // ============ RUTINAS RÁPIDAS ============
  'express-3dias': {
    nombre: 'Express - 3 días (45min)',
    objetivo: 'general',
    nivel: 'intermedio',
    diasSemana: 3,
    descripcion: 'Rutina eficiente para quien tiene poco tiempo. Solo ejercicios compuestos esenciales.',
    dias: [
      {
        nombre: 'Día 1 - Empuje',
        ejercicios: ['press-banca', 'press-militar', 'press-frances'],
        series: [4, 3, 3],
        reps: [8, 10, 12]
      },
      {
        nombre: 'Día 2 - Piernas',
        ejercicios: ['sentadilla', 'peso-muerto', 'curl-femoral'],
        series: [4, 4, 3],
        reps: [8, 6, 12]
      },
      {
        nombre: 'Día 3 - Tirón',
        ejercicios: ['dominadas', 'remo-barra', 'curl-barra'],
        series: [4, 4, 3],
        reps: [8, 8, 12]
      }
    ]
  }
}

export const ejerciciosService = {
  // Obtener todos los ejercicios (solo local)
  obtenerTodos() {
    return ejerciciosDB
  },

  // Obtener ejercicio por ID (busca primero en local, luego en API)
  async obtenerPorId(id) {
    // Buscar en catálogo local
    const local = ejerciciosDB.find(ej => ej.id === id)
    if (local) return local

    // Si no está en local y la API está configurada, buscar ahí
    if (exerciseDBAPI.isAPIConfigured()) {
      try {
        const apiData = await exerciseDBAPI.getExerciseById(id)
        return exerciseDBAPI.normalizarEjercicio(apiData)
      } catch (error) {
        console.warn(`No se pudo obtener ejercicio ${id} de la API:`, error)
        return null
      }
    }

    return null
  },

  // Filtrar por grupo muscular (híbrido: local + API)
  async obtenerPorGrupo(grupo, incluirAPI = true) {
    // Ejercicios locales
    const locales = ejerciciosDB.filter(ej => 
      ej.grupoMuscular === grupo || ej.gruposSecundarios.includes(grupo)
    )

    // Si no se debe incluir API o no está configurada, retornar solo locales
    if (!incluirAPI || !exerciseDBAPI.isAPIConfigured()) {
      return locales
    }

    // Buscar también en la API
    try {
      const apiResults = await exerciseDBAPI.buscarPorGrupoMuscular(grupo, 10)
      // Combinar resultados, evitando duplicados por ID
      const todosIds = new Set(locales.map(e => e.id))
      const apiUnicos = apiResults.filter(e => !todosIds.has(e.id))
      
      return [...locales, ...apiUnicos]
    } catch (error) {
      console.warn('Error obteniendo ejercicios de la API:', error)
      return locales
    }
  },

  // Filtrar por equipamiento disponible
  obtenerPorEquipamiento(equipamientos) {
    return ejerciciosDB.filter(ej => equipamientos.includes(ej.equipamiento))
  },

  // Buscar ejercicios por término (híbrido: local + API)
  async buscarEjercicios(termino, limite = 20) {
    const terminoLower = termino.toLowerCase()

    // Buscar en catálogo local
    const locales = ejerciciosDB.filter(ej =>
      ej.nombre.toLowerCase().includes(terminoLower) ||
      ej.descripcion.toLowerCase().includes(terminoLower) ||
      ej.grupoMuscular.toLowerCase().includes(terminoLower)
    )

    // Si la API está configurada, buscar también ahí
    if (exerciseDBAPI.isAPIConfigured()) {
      try {
        const apiResults = await exerciseDBAPI.buscarYNormalizar(termino, limite)
        
        // Combinar y eliminar duplicados
        const todosIds = new Set(locales.map(e => e.id))
        const apiUnicos = apiResults.filter(e => !todosIds.has(e.id))
        
        return [...locales, ...apiUnicos].slice(0, limite)
      } catch (error) {
        console.warn('Error en búsqueda de API:', error)
        return locales
      }
    }

    return locales
  },

  // Verificar estado de la API
  async verificarEstadoAPI() {
    return await exerciseDBAPI.checkAPIStatus()
  },

  // Obtener ejercicios similares (solo API)
  async obtenerSimilares(ejercicioId, limite = 5) {
    if (!exerciseDBAPI.isAPIConfigured()) {
      return []
    }

    try {
      return await exerciseDBAPI.obtenerEjerciciosSimilares(ejercicioId, limite)
    } catch (error) {
      console.warn('Error obteniendo similares:', error)
      return []
    }
  },

  // Obtener rutina según parámetros - MEJORADO
  generarRutina({ objetivo, nivel, diasSemana, equipamiento }) {
    // Mapeo inteligente de objetivo + días a templates
    const templateMapping = {
      // Fuerza
      'fuerza-3': 'fuerza-3dias',
      'fuerza-4': 'fuerza-4dias',
      'fuerza-5': 'fuerza-4dias', // Fallback
      
      // Hipertrofia
      'hipertrofia-3': 'hipertrofia-3dias',
      'hipertrofia-4': 'hipertrofia-4dias',
      'hipertrofia-5': 'hipertrofia-5dias',
      
      // Definición
      'definicion-3': 'definicion-4dias',
      'definicion-4': 'definicion-4dias',
      'definicion-5': 'hipertrofia-5dias',
      
      // General/Principiante
      'general-3': 'principiante-3dias',
      'general-4': 'hipertrofia-4dias',
      'general-5': 'hipertrofia-5dias'
    }

    // Buscar template exacto
    const mapKey = `${objetivo}-${diasSemana}`
    let templateKey = templateMapping[mapKey]
    
    // Fallbacks inteligentes por días
    if (!templateKey) {
      if (diasSemana === 3) {
        templateKey = nivel === 'principiante' ? 'principiante-3dias' : 
                      objetivo === 'fuerza' ? 'fuerza-3dias' : 'hipertrofia-3dias'
      } else if (diasSemana === 4) {
        templateKey = objetivo === 'fuerza' ? 'fuerza-4dias' : 'hipertrofia-4dias'
      } else if (diasSemana === 5) {
        templateKey = 'hipertrofia-5dias'
      } else {
        // Default para 2 días o 6+
        templateKey = 'express-3dias'
      }
    }

    const template = rutinasTemplates[templateKey]
    
    if (!template) {
      console.warn(`Template ${templateKey} no encontrado, usando principiante-3dias`)
      return rutinasTemplates['principiante-3dias']
    }
    
    // Si hay restricciones de equipamiento, filtrar ejercicios
    if (equipamiento && equipamiento.length > 0) {
      const rutinaCopy = JSON.parse(JSON.stringify(template))
      rutinaCopy.dias = rutinaCopy.dias.map(dia => {
        const ejerciciosFiltrados = dia.ejercicios.filter(ejId => {
          const ej = ejerciciosDB.find(e => e.id === ejId)
          return ej && equipamiento.includes(ej.equipamiento)
        })
        
        // Si se filtraron demasiados, mantener al menos los compuestos
        if (ejerciciosFiltrados.length < 2) {
          return dia // Mantener día original si filtrar deja muy pocos
        }
        
        return { 
          ...dia, 
          ejercicios: ejerciciosFiltrados,
          series: dia.series.slice(0, ejerciciosFiltrados.length),
          reps: dia.reps.slice(0, ejerciciosFiltrados.length)
        }
      })
      
      // Actualizar objetivo y nivel con los valores seleccionados
      rutinaCopy.objetivo = objetivo
      rutinaCopy.nivel = nivel
      
      return rutinaCopy
    }

    // Crear copia y actualizar con valores seleccionados
    const rutinaCopy = JSON.parse(JSON.stringify(template))
    rutinaCopy.objetivo = objetivo
    rutinaCopy.nivel = nivel
    
    return rutinaCopy
  },

  // Obtener todas las plantillas disponibles
  obtenerPlantillasDisponibles() {
    return Object.entries(rutinasTemplates).map(([key, template]) => ({
      key,
      ...template,
      // Solo metadata, no días completos
      cantidadDias: template.dias.length,
      totalEjercicios: template.dias.reduce((sum, dia) => sum + dia.ejercicios.length, 0)
    }))
  },

  // Obtener plantillas filtradas
  obtenerPlantillasPorFiltro({ objetivo, nivel, diasSemana }) {
    return this.obtenerPlantillasDisponibles().filter(template => {
      if (objetivo && template.objetivo !== objetivo) return false
      if (nivel && template.nivel !== nivel) return false
      if (diasSemana && template.diasSemana !== diasSemana) return false
      return true
    })
  },

  // Obtener grupos musculares únicos
  obtenerGruposMusculares() {
    const grupos = new Set()
    ejerciciosDB.forEach(ej => {
      grupos.add(ej.grupoMuscular)
      ej.gruposSecundarios.forEach(g => grupos.add(g))
    })
    return Array.from(grupos)
  }
}
