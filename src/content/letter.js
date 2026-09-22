// ---------------------------------------------------------------------------
// TEXTO DE LA CARTA
//
// Todo lo que sigue son BORRADORES míos para que tengas de dónde agarrarte.
// Cambiá lo que quieras: la carta tiene que sonar a vos, no a mí.
// Debajo de cada texto te dejé una o dos versiones alternativas comentadas
// (las líneas que empiezan con //). Si te gusta más una de esas, borrá la que
// está activa y descomentá la otra.
//
// Los saltos de línea dobles (\n\n) se convierten en párrafos separados.
// ---------------------------------------------------------------------------

export const letter = {
  // Inicial que aparece en el sello de cera del sobre.
  recipientInitial: 'X', // TODO (Diego): la inicial de tu hermana

  // Nombre que se muestra en el subtítulo del sobre (dejalo vacío '' si no querés).
  recipientName: '', // TODO (Diego): opcional

  pages: [
    {
      title: 'Para ti',
      body:
        'Hay cosas que uno no dice en el día a día, porque parece que siempre va a haber tiempo para decirlas.\n\n' +
        'Hoy quiero decirlas.\n\n' +
        'Crecí viéndote crecer. Y en algún momento, sin avisarme, dejaste de ser la niña que me seguía a todos lados y te convertiste en alguien a quien admiro.\n\n' +
        'Esta carta es mi manera de guardar todo eso en un solo lugar, para que lo puedas abrir cuando quieras.',

      // --- Versión alternativa 1 (más corta y directa) ---
      // body:
      //   'No soy bueno para decir estas cosas en voz alta, así que las escribí.\n\n' +
      //   'Gracias por cada día en que fuiste mi hermana sin que nadie te lo pidiera.\n\n' +
      //   'Hoy es tu día, y quería que empezara con algo hecho a mano.',

      // --- Versión alternativa 2 (más tierna) ---
      // body:
      //   'Te conocí cuando eras del tamaño de mis dos manos.\n\n' +
      //   'Hoy tengo que levantar la mirada para hablarte, y sigo sin acostumbrarme.\n\n' +
      //   'Ojalá esta carta te dure más que el día.',
    },
    {
      title: 'Un poema',
      body:
        'Fuimos dos sombras pequeñas\n' +
        'midiendo el patio a carcajadas,\n' +
        'sin saber que los días\n' +
        'se iban guardando solos.\n\n' +
        'Creciste como crece lo bueno:\n' +
        'despacio, y de repente.\n\n' +
        'Y aunque el mundo te quede grande\n' +
        'y algún día te lleve lejos,\n' +
        'hay un lugar donde siempre vas a ser\n' +
        'la niña que se reía conmigo.',

      // --- Versión alternativa 1 (sobre el tiempo y las fotos) ---
      // body:
      //   'No guardé los días,\n' +
      //   'se guardaron ellos solos:\n' +
      //   'en una playa, en unas ruedas,\n' +
      //   'en un cuarto recién pintado.\n\n' +
      //   'Yo solo aprendí a mirarte\n' +
      //   'mientras te volvías vos.\n\n' +
      //   'Y de todo lo que he visto crecer,\n' +
      //   'nada me ha dado tanto orgullo.',

      // --- Versión alternativa 2 (más breve) ---
      // body:
      //   'Que la vida te dé\n' +
      //   'tantas razones para reírte\n' +
      //   'como las que vos me diste a mí.\n\n' +
      //   'Con eso basta.\n' +
      //   'Con eso sobra.',
    },
    // Podés agregar hasta una página más con el mismo formato:
    // { title: '…', body: '…' },
  ],
};

// ---------------------------------------------------------------------------
// SECCIONES DEL SCROLL NARRATIVO (lo que va entre la carta y las fotos)
// Cada sección aparece con fade-in + slide-up cuando entra en pantalla.
// Podés agregar o borrar las que quieras.
// ---------------------------------------------------------------------------
export const storySections = [
  {
    title: 'Antes de seguir',
    body:
      'Quiero que sepas desde dónde te estoy escribiendo.\n\n' +
      'No desde la nostalgia. Desde el orgullo.',

    // Alternativa:
    // body: 'Respirá. Lo que viene lo armé despacio, pensando en vos.',
  },
  {
    title: 'Lo que quiero que sepas',
    body:
      'Que te vi aprender a caerte, y también a levantarte sola.\n\n' +
      'Que no siempre supe decírtelo, pero siempre estuve mirando.\n\n' +
      'Y que si alguna vez dudás de vos, yo tengo pruebas.',

    // Alternativa:
    // body:
    //   'Que sos más fuerte de lo que te contás a vos misma.\n\n' +
    //   'Que lo bueno que te pasa no es suerte: es consecuencia.\n\n' +
    //   'Y que nunca vas a estar sola mientras yo ande por acá.',
  },
  {
    title: 'Las pruebas',
    body:
      'Bajá despacio.\n\n' +
      'Cada foto es un día que ya pasó y que, aun así, todavía nos pertenece.',

    // Alternativa:
    // body: 'Acá están. Míralas sin apuro: cada una es un pedazo de los dos.',
  },
];
