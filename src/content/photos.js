// ---------------------------------------------------------------------------
// LÍNEA DE TIEMPO DE FOTOS
//
// Sin años ni fechas: lo único que manda es el ORDEN en que están escritas acá.
// Si querés mover una foto de lugar, cortala y pegala donde quieras — la línea
// de tiempo se reordena sola.
//
// Los captions son borradores míos, escritos a partir de cómo llamaste vos a
// cada archivo. Cambiá el que no te guste: es tu voz la que tiene que sonar.
//
// stage: 'peques' | 'ninez' | 'adolescencia' | 'ahora'
//   · caption = lo que se lee debajo de la foto.
//   · alt     = descripción para lectores de pantalla (accesibilidad).
//               Si lo dejás vacío se arma uno genérico solo.
// ---------------------------------------------------------------------------

export const photos = [
  // --- PEQUES ---------------------------------------------------------------
  {
    src: '/media/photos/peques-01.jpg',
    stage: 'peques',
    caption: 'Cuando el mundo entero nos cabía en un solo cuarto.',
    alt: 'Mi hermana y yo muy pequeños',
  },
  {
    src: '/media/photos/peques-02.jpg',
    stage: 'peques',
    caption: 'Todos juntos, cuando todavía no sabíamos que eso era la felicidad.',
    alt: 'Toda la familia reunida cuando éramos pequeños',
  },
  {
    src: '/media/photos/peques-03.jpg',
    stage: 'peques',
    caption: 'Vos y yo. Ese siempre fue el equipo.',
    alt: 'Mi hermana y yo de niños, juntos',
  },
  {
    src: '/media/photos/peques-04.jpg',
    stage: 'peques',
    caption: 'Tan chiquita frente a tanto mar, y sin una pizca de miedo.',
    alt: 'Mi hermana de pequeña, sola frente al mar en la playa',
  },

  // --- NIÑEZ ----------------------------------------------------------------
  {
    src: '/media/photos/ninez-01.jpg',
    stage: 'ninez',
    caption: 'No te querías subir. Te subí igual. Después no te querías bajar.',
    alt: 'Mi hermana y yo en las ruedas, en Opico',
  },
  {
    src: '/media/photos/ninez-02.jpg',
    stage: 'ninez',
    caption: 'Gritando y riéndote al mismo tiempo, como siempre.',
    alt: 'Otra foto del viaje a las ruedas',
  },
  {
    src: '/media/photos/ninez-03.jpg',
    stage: 'ninez',
    caption: 'Pintamos mi cuarto y terminamos pintados nosotros.',
    alt: 'Mi hermana y yo pintando mi cuarto',
  },
  {
    src: '/media/photos/ninez-04.jpg',
    stage: 'ninez',
    caption: 'Un día cualquiera con mamá. De esos que uno no sabe que va a extrañar.',
    alt: 'Mi hermana y yo con nuestra mamá',
  },

  // --- ADOLESCENCIA ---------------------------------------------------------
  {
    src: '/media/photos/adolescencia-01.jpg',
    stage: 'adolescencia',
    caption: 'El día que te vi con el diploma y entendí que ya no eras la niña de la playa.',
    alt: 'Mi hermana el día de su graduación de noveno grado',
  },
  {
    src: '/media/photos/adolescencia-02.jpg',
    stage: 'adolescencia',
    caption: 'Salir a comer sin apuro, hablando de todo y de nada.',
    alt: 'Mi hermana y yo comiendo en Metrocentro',
  },
  {
    src: '/media/photos/adolescencia-03.jpg',
    stage: 'adolescencia',
    caption: 'Yo con el pelo largo y vos aguantándome las ocurrencias.',
    alt: 'Mi hermana y yo en Metrocentro, cuando yo tenía el cabello largo',
  },
  {
    src: '/media/photos/adolescencia-04.jpg',
    stage: 'adolescencia',
    caption: 'Hasta en el año más raro encontramos la forma de salir a reírnos.',
    alt: 'Mi hermana, mamá y yo durante la pandemia',
  },
  {
    src: '/media/photos/adolescencia-05.jpg',
    stage: 'adolescencia',
    caption: 'Te levantaste antes que el sol. Nunca te ha dado miedo el esfuerzo.',
    alt: 'Mi hermana madrugando para irse a clases',
  },

  // --- AHORA ----------------------------------------------------------------
  {
    src: '/media/photos/ahora-01.jpg',
    stage: 'ahora',
    caption: 'El día de la inauguración quise que vos lo vieras primero.',
    alt: 'Mi hermana en mi trabajo, el día de la inauguración del restaurante',
  },
  {
    src: '/media/photos/ahora-02.jpg',
    stage: 'ahora',
    caption: 'Me subió a su estado para avisarle al mundo que no soy normal. Tiene razón.',
    alt: 'Captura del estado en el que mi hermana me publicó',
  },
  {
    src: '/media/photos/ahora-03.jpg',
    stage: 'ahora',
    caption: 'Y acá estás hoy. Mirá todo lo que sos.',
    alt: 'Mi hermana hoy',
  },
];

// Nombres bonitos de cada etapa (los que se ven en pantalla).
export const stageLabels = {
  peques: 'Peques',
  ninez: 'Niñez',
  adolescencia: 'Adolescencia',
  ahora: 'Ahora',
};

// Orden en el que se muestran las etapas.
export const stageOrder = ['peques', 'ninez', 'adolescencia', 'ahora'];
