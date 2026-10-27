import dotenv from 'dotenv';
import { prisma, disconnectDatabase } from '../src/config/database.js';

dotenv.config();

const muscleGroupsData = [
  {
    name: 'Pecho',
    description: 'Pectoral mayor, pectoral menor y serrato anterior.'
  },
  {
    name: 'Espalda',
    description: 'Dorsal ancho, trapecio, romboides, redondo mayor y erectores espinales.'
  },
  {
    name: 'Hombros',
    description: 'Deltoides anterior, lateral y posterior.'
  },
  {
    name: 'Bíceps',
    description: 'Bíceps braquial, braquial anterior y braquiorradial.'
  },
  {
    name: 'Tríceps',
    description: 'Cabeza lateral, cabeza medial y cabeza larga del tríceps braquial.'
  },
  {
    name: 'Piernas',
    description: 'Cuádriceps, isquiotibiales (femoral) y gemelos (pantorrillas).'
  },
  {
    name: 'Glúteos',
    description: 'Glúteo mayor, glúteo medio y glúteo menor.'
  },
  {
    name: 'Abdomen',
    description: 'Recto abdominal, oblicuos internos, externos y transverso del abdomen.'
  },
  {
    name: 'Cuerpo completo',
    description: 'Movimientos funcionales y multiarticulares que involucran múltiples cadenas musculares.'
  }
];

const exercisesData = [
  // PECHO
  {
    name: 'Press de Banca Plano con Barra',
    muscleGroupName: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Hombros'],
    equipment: 'Barra',
    difficulty: 'intermediate',
    description: 'Ejercicio básico compuesto por excelencia para el desarrollo del pectoral mayor.',
    instructions: [
      'Acuéstate sobre el banco plano con los ojos directamente bajo la barra.',
      'Agarra la barra a un ancho ligeramente mayor que los hombros y retrae las escápulas.',
      'Baja la barra de forma controlada hasta la mitad del pecho tocando suavemente.',
      'Empuja la barra con fuerza hacia arriba extendiendo los brazos sin bloquear bruscamente los codos.'
    ]
  },
  {
    name: 'Press Inclinado con Mancuernas',
    muscleGroupName: 'Pecho',
    secondaryMuscles: ['Hombros', 'Tríceps'],
    equipment: 'Mancuernas',
    difficulty: 'intermediate',
    description: 'Focaliza la porción clavicular (superior) del pectoral con gran rango de movimiento.',
    instructions: [
      'Ajusta el banco a una inclinación de entre 30 y 45 grados.',
      'Sube las mancuernas al pecho con impulso de las rodillas y mantén el pecho erguido.',
      'Baja las mancuernas controlando la apertura de los codos a unos 45-60 grados respecto al torso.',
      'Presiona hacia arriba acercando las mancuernas sin llegar a chocarlas.'
    ]
  },
  {
    name: 'Aperturas en Polea (Cruces)',
    muscleGroupName: 'Pecho',
    secondaryMuscles: ['Hombros'],
    equipment: 'Polea / Cable',
    difficulty: 'beginner',
    description: 'Ejercicio de aislamiento para lograr una máxima contracción y tensión continua en el pecho.',
    instructions: [
      'Coloca las poleas a la altura del pecho o superior y da un paso al frente con zancada estable.',
      'Con una ligera flexión en los codos, lleva las manos hacia el frente hasta que se junten.',
      'Aprieta los pectorales en el punto de máxima contracción durante 1 segundo.',
      'Regresa despacio sintiendo el estiramiento en la caja torácica.'
    ]
  },
  {
    name: 'Fondos en Paralelas (Enfocado en Pecho)',
    muscleGroupName: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Hombros'],
    equipment: 'Barras Paralelas',
    difficulty: 'advanced',
    description: 'Excelente ejercicio con peso corporal para el desarrollo del pectoral inferior.',
    instructions: [
      'Apóyate en las barras paralelas inclinando el torso unos 30 grados hacia adelante.',
      'Flexiona los codos descendiendo hasta que los hombros queden ligeramente por debajo de los codos.',
      'Empuja con el pecho extendiendo los brazos hasta la posición de inicio.'
    ]
  },

  // ESPALDA
  {
    name: 'Dominadas Pronas (Pull-ups)',
    muscleGroupName: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Hombros', 'Antebrazos'],
    equipment: 'Barra fija',
    difficulty: 'advanced',
    description: 'El movimiento fundamental de tracción vertical para amplitud dorsal.',
    instructions: [
      'Sujeta la barra con agarre prono a un ancho superior al de los hombros.',
      'Inicia el movimiento activando los dorsales y deprimiendo las escápulas.',
      'Tira con fuerza hasta que la barbilla supere con claridad la barra.',
      'Desciende de manera controlada hasta la extensión completa de los brazos.'
    ]
  },
  {
    name: 'Remo con Barra Pendlay / 90°',
    muscleGroupName: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Trapecio', 'Erectores'],
    equipment: 'Barra',
    difficulty: 'intermediate',
    description: 'Constructor masivo de densidad para toda la zona media y alta de la espalda.',
    instructions: [
      'Colócate frente a la barra con los pies a la anchura de las caderas y flexiona la cadera manteniendo la espalda recta.',
      'Agarra la barra en pronación y tira de los codos hacia atrás pegándolos al cuerpo.',
      'Lleva la barra hacia el ombligo contrayendo fuertemente los dorsales y romboides.',
      'Baja controlando el peso hasta la posición inicial.'
    ]
  },
  {
    name: 'Jalón al Pecho en Polea Alta',
    muscleGroupName: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Hombros'],
    equipment: 'Polea / Cable',
    difficulty: 'beginner',
    description: 'Variación de tracción vertical idónea para controlar la técnica y sobrecarga progresiva.',
    instructions: [
      'Ajusta la almohadilla de los muslos para asegurar una posición firme en el banco.',
      'Toma la barra ancha, inclina el torso levemente hacia atrás y saca pecho.',
      'Tira de la barra hacia la clavícula enfocando la fuerza en los codos hacia el suelo.',
      'Extiende los brazos lentamente sintiendo el estiramiento completo del dorsal.'
    ]
  },
  {
    name: 'Remo Gironda (Remo Sentado en Polea)',
    muscleGroupName: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Trapecio'],
    equipment: 'Polea / Cable',
    difficulty: 'beginner',
    description: 'Tracción horizontal guiada con agarre estrecho para grosor de espalda.',
    instructions: [
      'Siéntate con los pies apoyados en la plataforma y mantén una ligera flexión en las rodillas.',
      'Mantén la columna neutral y tira del agarre hacia el abdomen bajo.',
      'Junta las escápulas al final del movimiento y regresa estirando sin redondear la espalda.'
    ]
  },

  // HOMBROS
  {
    name: 'Press Militar con Barra de Pie (Overhead Press)',
    muscleGroupName: 'Hombros',
    secondaryMuscles: ['Tríceps', 'Abdomen', 'Cuerpo completo'],
    equipment: 'Barra',
    difficulty: 'advanced',
    description: 'Empuje vertical estricto para desarrollar fuerza y volumen en los deltoides.',
    instructions: [
      'Sostén la barra apoyada sobre las clavículas con pies firmes y abdomen contraído.',
      'Empuja la barra verticalmente pasando cerca del rostro hasta bloquear sobre la cabeza.',
      'Pasa la cabeza hacia el frente una vez que la barra la supere.',
      'Baja con control hasta volver a apoyar en la parte alta del torso.'
    ]
  },
  {
    name: 'Elevaciones Laterales con Mancuernas',
    muscleGroupName: 'Hombros',
    secondaryMuscles: ['Trapecio'],
    equipment: 'Mancuernas',
    difficulty: 'beginner',
    description: 'Aislamiento esencial para la cabeza lateral del deltoide y anchura de hombros.',
    instructions: [
      'De pie o sentado, toma las mancuernas a los lados del cuerpo.',
      'Eleva los brazos hacia los costados con los codos ligeramente flexionados hasta la altura de los hombros.',
      'Pausa medio segundo en el punto alto dirigiendo los codos hacia arriba.',
      'Baja de forma suave resistiendo la gravedad.'
    ]
  },
  {
    name: 'Pájaros con Mancuernas (Deltoide Posterior)',
    muscleGroupName: 'Hombros',
    secondaryMuscles: ['Trapecio', 'Romboides'],
    equipment: 'Mancuernas',
    difficulty: 'intermediate',
    description: 'Enfocado en el deltoide posterior para equilibrar la postura y la articulación del hombro.',
    instructions: [
      'Inclina el torso hacia adelante manteniendo la espalda recta a 45 o 90 grados.',
      'Abre los brazos lateralmente tirando desde los codos sin encoger el cuello.',
      'Aprieta la parte trasera de los hombros en la cima y desciende con suavidad.'
    ]
  },

  // BÍCEPS
  {
    name: 'Curl de Bíceps con Barra Z',
    muscleGroupName: 'Bíceps',
    secondaryMuscles: ['Antebrazos'],
    equipment: 'Barra Z',
    difficulty: 'beginner',
    description: 'Constructor básico de bíceps con un agarre ergonómico que cuida las muñecas.',
    instructions: [
      'Toma la barra Z con las palmas mirando hacia arriba y los codos pegados a los costados.',
      'Flexiona los codos elevando la barra hacia el pecho sin balancear el cuerpo.',
      'Contrae fuertemente el bíceps en el punto máximo de flexión.',
      'Baja controlando la fase excéntrica durante 2-3 segundos.'
    ]
  },
  {
    name: 'Curl Martillo con Mancuernas',
    muscleGroupName: 'Bíceps',
    secondaryMuscles: ['Antebrazos'],
    equipment: 'Mancuernas',
    difficulty: 'beginner',
    description: 'Trabaja el braquial y braquiorradial, aumentando el grosor visual del brazo.',
    instructions: [
      'Sostén las mancuernas con las palmas enfrentadas (agarre neutro).',
      'Eleva las mancuernas simultánea o alternadamente manteniendo los codos inmóviles.',
      'Aprieta en la cima y desciende lentamente sin mover los hombros.'
    ]
  },
  {
    name: 'Curl Inclinado en Banco',
    muscleGroupName: 'Bíceps',
    secondaryMuscles: ['Antebrazos'],
    equipment: 'Mancuernas',
    difficulty: 'intermediate',
    description: 'Pone en máxima tensión la cabeza larga del bíceps gracias al estiramiento inicial.',
    instructions: [
      'Ajusta un banco a 45 o 60 grados y apoya la espalda y cabeza completamente.',
      'Deja caer los brazos estirados verticalmente con las mancuernas.',
      'Realiza el curl supinando la muñeca al subir y siente el estiramiento profundo al bajar.'
    ]
  },

  // TRÍCEPS
  {
    name: 'Extensiones de Tríceps en Polea Alta (Cuerda)',
    muscleGroupName: 'Tríceps',
    secondaryMuscles: ['Antebrazos'],
    equipment: 'Polea / Cable',
    difficulty: 'beginner',
    description: 'Aislamiento de la cabeza lateral y medial del tríceps con contracción en pico.',
    instructions: [
      'Agarra los extremos de la cuerda en polea alta con codos pegados a las costillas.',
      'Empuja la cuerda hacia abajo y abre los extremos al final del recorrido.',
      'Aprieta los tríceps durante 1 segundo al extender completamente los brazos.',
      'Sube los antebrazos hasta los 90 grados sin separar los codos.'
    ]
  },
  {
    name: 'Press Francés con Barra Z (Skull Crushers)',
    muscleGroupName: 'Tríceps',
    secondaryMuscles: ['Pecho', 'Hombros'],
    equipment: 'Barra Z',
    difficulty: 'intermediate',
    description: 'Incide directamente sobre la cabeza larga del tríceps para máximo volumen de brazo.',
    instructions: [
      'Acuéstate sobre un banco plano sosteniendo la barra Z con brazos estirados perpendiculares al suelo.',
      'Flexiona los codos bajando la barra hacia la frente o justo detrás de la coronilla.',
      'Mantén los codos cerrados y estables en todo momento.',
      'Extiende los brazos contrayendo los tríceps hasta la posición vertical.'
    ]
  },
  {
    name: 'Fondos en Banco entre Bancos',
    muscleGroupName: 'Tríceps',
    secondaryMuscles: ['Pecho', 'Hombros'],
    equipment: 'Banco',
    difficulty: 'beginner',
    description: 'Ejercicio accesible para trabajar los tríceps con el propio peso o discos adicionales.',
    instructions: [
      'Coloca las palmas en el borde del banco y las piernas extendidas al frente.',
      'Desciende flexionando los codos hasta que alcancen un ángulo de 90 grados.',
      'Empuja contra el banco con las palmas hasta extender de nuevo los brazos.'
    ]
  },

  // PIERNAS
  {
    name: 'Sentadilla Trasera con Barra (Barbell Squat)',
    muscleGroupName: 'Piernas',
    secondaryMuscles: ['Glúteos', 'Abdomen', 'Erectores'],
    equipment: 'Barra',
    difficulty: 'advanced',
    description: 'El ejercicio rey para fuerza, hipertrofia de cuádriceps y desarrollo de tren inferior.',
    instructions: [
      'Apoya la barra sobre los trapecios y separa los pies a la anchura de los hombros.',
      'Inicia el descenso empujando las caderas hacia atrás y flexionando las rodillas.',
      'Baja al menos hasta que los muslos queden paralelos al suelo manteniendo el pecho alto.',
      'Empuja con toda la planta de los pies para regresar a la posición vertical.'
    ]
  },
  {
    name: 'Prensa de Piernas a 45°',
    muscleGroupName: 'Piernas',
    secondaryMuscles: ['Glúteos'],
    equipment: 'Máquina',
    difficulty: 'beginner',
    description: 'Permite sobrecargar intensamente los cuádriceps y glúteos con seguridad lumbar.',
    instructions: [
      'Siéntate en la máquina apoyando la espalda y glúteos firmemente contra el respaldo.',
      'Coloca los pies a la mitad de la plataforma separados a la anchura de caderas.',
      'Destraba la seguridad y baja la plataforma controlando la flexión de rodillas a 90 grados.',
      'Empuja la plataforma sin bloquear completamente las rodillas en la extensión.'
    ]
  },
  {
    name: 'Extensiones de Cuádriceps en Máquina',
    muscleGroupName: 'Piernas',
    secondaryMuscles: [],
    equipment: 'Máquina',
    difficulty: 'beginner',
    description: 'Aislamiento estricto de los cuatro vientres del cuádriceps.',
    instructions: [
      'Alinea el eje de giro de la máquina con tus rodillas y coloca la almohadilla sobre los empeines.',
      'Extiende las piernas hacia arriba apretando los cuádriceps en el tope.',
      'Desciende de manera suave durante 2 segundos hasta el estiramiento.'
    ]
  },
  {
    name: 'Curl Femoral Tumbado en Máquina',
    muscleGroupName: 'Piernas',
    secondaryMuscles: ['Glúteos', 'Gemelos'],
    equipment: 'Máquina',
    difficulty: 'beginner',
    description: 'Aislamiento directo para la cadena posterior e isquiosurales.',
    instructions: [
      'Acuéstate boca abajo con la almohadilla colocada justo por encima de los talones.',
      'Flexiona las rodillas llevando los talones hacia los glúteos de forma enérgica.',
      'Aguanta la contracción un instante y desciende controlando la fase negativa.'
    ]
  },
  {
    name: 'Elevación de Talones de Pie (Gemelos)',
    muscleGroupName: 'Piernas',
    secondaryMuscles: ['Pies'],
    equipment: 'Máquina / Mancuernas',
    difficulty: 'beginner',
    description: 'Desarrollo de los gemelos (gastrocnemios) mediante flexión plantar completa.',
    instructions: [
      'Apoya las puntas de los pies en el escalón y deja descender los talones para estirar.',
      'Impúlsate hacia arriba sobre las puntas de los pies hasta la máxima contracción.',
      'Pausa un segundo arriba y baja despacio sintiendo el estiramiento en la pantorrilla.'
    ]
  },

  // GLÚTEOS
  {
    name: 'Hip Thrust con Barra',
    muscleGroupName: 'Glúteos',
    secondaryMuscles: ['Isquiotibiales', 'Abdomen'],
    equipment: 'Barra y Banco',
    difficulty: 'intermediate',
    description: 'El mejor ejercicio con evidencia científica para activación del glúteo mayor.',
    instructions: [
      'Apoya la parte media de la espalda sobre el banco y rueda la barra acolchada sobre las caderas.',
      'Coloca los pies a la anchura de hombros con rodillas a 90 grados en la cima.',
      'Extiende las caderas empujando con los talones hasta alinear torso y muslos.',
      'Aprieta con fuerza los glúteos durante un segundo y desciende controladamente.'
    ]
  },
  {
    name: 'Peso Muerto Rumano con Mancuernas',
    muscleGroupName: 'Glúteos',
    secondaryMuscles: ['Isquiotibiales', 'Espalda baja'],
    equipment: 'Mancuernas',
    difficulty: 'intermediate',
    description: 'Enfoque en bisagra de cadera con gran tensión excéntrica en glúteos y femorales.',
    instructions: [
      'Párate erguido sosteniendo las mancuernas frente a los muslos.',
      'Empuja la cadera hacia atrás con rodillas semiflexionadas deslizando las mancuernas por las piernas.',
      'Baja hasta sentir un estiramiento marcado en los isquiotibiales manteniendo la espalda neutra.',
      'Empuja las caderas al frente contrayendo los glúteos para volver a subir.'
    ]
  },
  {
    name: 'Patada de Glúteo en Polea',
    muscleGroupName: 'Glúteos',
    secondaryMuscles: ['Isquiotibiales'],
    equipment: 'Polea / Cable',
    difficulty: 'beginner',
    description: 'Aislamiento continuo para hipertrofia y conexión mente-músculo en glúteo.',
    instructions: [
      'Coloca una tobillera conectada a la polea baja e inclina ligeramente el torso hacia el poste.',
      'Patea la pierna hacia atrás y ligeramente hacia afuera usando la fuerza del glúteo.',
      'Aprieta en el punto más alto y regresa sin arquear la zona lumbar.'
    ]
  },

  // ABDOMEN
  {
    name: 'Elevación de Piernas Colgado en Barra',
    muscleGroupName: 'Abdomen',
    secondaryMuscles: ['Flexores de cadera', 'Antebrazos'],
    equipment: 'Barra fija',
    difficulty: 'advanced',
    description: 'Ejercicio de alta demanda para la porción inferior del recto abdominal y fuerza de agarre.',
    instructions: [
      'Cuélgate de una barra con brazos extendidos y cuerpo estable sin balanceo.',
      'Eleva las piernas rectas o flexionadas hacia el pecho contrayendo el abdomen.',
      'Intenta enrollar la pelvis ligeramente hacia arriba al final del recorrido.',
      'Baja despacio resistiendo la oscilación del cuerpo.'
    ]
  },
  {
    name: 'Crunch Abdominal en Polea Alta',
    muscleGroupName: 'Abdomen',
    secondaryMuscles: [],
    equipment: 'Polea / Cable',
    difficulty: 'intermediate',
    description: 'Permite sobrecargar progresivamente los músculos del abdomen con resistencia constante.',
    instructions: [
      'Arrodíllate frente a la polea alta sosteniendo la cuerda a los lados de la cabeza.',
      'Flexiona la columna enrollando el torso hacia los muslos usando los abdominales.',
      'Exhala y aprieta el abdomen al máximo en la posición más baja.',
      'Extiende despacio la columna sin dejar que el peso separe las manos de la cabeza.'
    ]
  },
  {
    name: 'Plancha Abdominal Isométrica (Plank)',
    muscleGroupName: 'Abdomen',
    secondaryMuscles: ['Hombros', 'Glúteos'],
    equipment: 'Peso corporal',
    difficulty: 'beginner',
    description: 'Fortalecimiento de la musculatura profunda del core y estabilidad lumbar.',
    instructions: [
      'Apoya los antebrazos y las puntas de los pies en el suelo alineando codos bajo los hombros.',
      'Mantén el cuerpo en línea recta desde los talones hasta la coronilla.',
      'Activa fuertemente abdomen, cuádriceps y glúteos evitando que la cadera se hunda.',
      'Respira con calma manteniendo la posición durante el tiempo establecido.'
    ]
  },

  // CUERPO COMPLETO
  {
    name: 'Peso Muerto Convencional con Barra',
    muscleGroupName: 'Cuerpo completo',
    secondaryMuscles: ['Espalda', 'Glúteos', 'Piernas', 'Antebrazos'],
    equipment: 'Barra',
    difficulty: 'advanced',
    description: 'El ejercicio de fuerza y masa corporal total por excelencia.',
    instructions: [
      'Párate frente a la barra con los pies al ancho de hombros y la espinilla rozando la barra.',
      'Baja la cadera, agarra la barra por fuera de las piernas y fija la espalda recta sacando pecho.',
      'Empuja el suelo con los pies y extiende caderas y rodillas al unísono.',
      'Bloquea arriba erguido y desciende la barra con control hacia el suelo.'
    ]
  },
  {
    name: 'Clean and Press (Cargada y Empuje)',
    muscleGroupName: 'Cuerpo completo',
    secondaryMuscles: ['Hombros', 'Piernas', 'Espalda', 'Tríceps'],
    equipment: 'Barra',
    difficulty: 'advanced',
    description: 'Movimiento olímpico funcional para potencia, velocidad y resistencia muscular completa.',
    instructions: [
      'Inicia con la barra en el suelo, tira de ella explosivamente hacia arriba con cadera y piernas.',
      'Gira los codos con rapidez recibiendo la barra en posición de sentadilla frontal sobre los hombros.',
      'Impúlsate con las piernas y empuja la barra directamente por encima de la cabeza.',
      'Baja con seguridad a los hombros y de vuelta al suelo.'
    ]
  }
];

export async function runSeed() {
  console.log('[PostgreSQL / Prisma] Iniciando seed de datos para FORGE...');

  try {
    // 1. Grupos Musculares (Idempotente)
    console.log('[Seed] Verificando grupos musculares en PostgreSQL...');
    const muscleGroupMap = {};

    for (const group of muscleGroupsData) {
      const record = await prisma.muscleGroup.upsert({
        where: { name: group.name },
        update: { description: group.description },
        create: { name: group.name, description: group.description }
      });
      muscleGroupMap[group.name] = record.id;
    }
    console.log(`[Seed] ${Object.keys(muscleGroupMap).length} grupos musculares asegurados.`);

    // 2. Ejercicios (Idempotente)
    console.log('[Seed] Verificando catálogo de ejercicios...');
    let count = 0;

    for (const ex of exercisesData) {
      const muscleGroupId = muscleGroupMap[ex.muscleGroupName];
      if (!muscleGroupId) continue;

      await prisma.exercise.upsert({
        where: { name: ex.name },
        update: {
          description: ex.description,
          muscleGroupId,
          secondaryMuscles: JSON.stringify(ex.secondaryMuscles),
          equipment: ex.equipment,
          difficulty: ex.difficulty,
          instructions: JSON.stringify(ex.instructions),
          imageUrl: ex.imageUrl || ''
        },
        create: {
          name: ex.name,
          description: ex.description,
          muscleGroupId,
          secondaryMuscles: JSON.stringify(ex.secondaryMuscles),
          equipment: ex.equipment,
          difficulty: ex.difficulty,
          instructions: JSON.stringify(ex.instructions),
          imageUrl: ex.imageUrl || ''
        }
      });
      count++;
    }

    console.log(`[Seed] ${count} ejercicios asegurados en PostgreSQL.`);
    console.log('[Seed] Poblado completado con éxito.');
  } catch (error) {
    console.error('[Seed] Error durante el seed en PostgreSQL:', error.message);
    throw error;
  } finally {
    await disconnectDatabase();
  }
}

// Ejecutar si se invoca directamente desde CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
