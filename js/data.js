/* ==========================================================================
   Datos del catálogo, imágenes, categorías y slider (js/data.js)
   ========================================================================== */

const IMG = {
  jabon: 'img/jabon.jpg',
  jabon2: 'img/jabon2.jpg',
  vela: 'img/vela.jpg',
  melts: 'img/melts.jpg',
  sachet: 'img/sachet.jpg',
  pebetero: 'img/pebetero.jpg',
  kitA: 'img/kitA.jpg',
  kitB: 'img/kitB.jpg',
  kitC: 'img/kitC.jpg',
  kitD: 'img/kitD.jpg',
  kitE: 'img/kitE.jpg'
};

const CATS = ['Jabones', 'Velas', 'Wax melts', 'Sachets', 'Pebeteros', 'Kits'];

const SL = [
  {
    i: 'sachet',
    k: 'Aromas para el hogar',
    t: 'Wax sachets con flores',
    p: 'Piezas decorativas para perfumar tus espacios.',
    c: 'Sachets'
  },
  {
    i: 'vela',
    k: 'Luz, aroma y calidez',
    t: 'Velas aromáticas',
    p: 'Un detalle cálido para acompañar tus momentos en casa.',
    c: 'Velas'
  },
  {
    i: 'jabon',
    k: 'ÂME Skin',
    t: 'Jabones artesanales',
    p: 'Cuidado corporal con un toque delicado.',
    c: 'Jabones'
  }
];

/* Listas de aromas reutilizables */
const AV = ['Vainilla', 'Lavanda', 'Frutos rojos', 'Coco', 'Canela'];
const AM = ['Vainilla', 'Lavanda', 'Frutos rojos', 'Coco', 'Café', 'Canela'];
const AS = ['Coco', 'Limón-vainilla', 'Fiesta de flores', 'Mango', 'Jingle bells', 'Miel'];

/* Helpers para construir arreglos de variantes (tamaño / versión / precio) */
const U = (price) => [{ n: 'Unidad', p: price }];
const KV = (withBurnerPrice, withoutBurnerPrice) => [
  { n: 'Con pebetero', p: withBurnerPrice },
  { n: 'Sin pebetero', p: withoutBurnerPrice }
];
const PK = [{ n: 'Por kit', p: 0 }];

const PRODUCTS = [
  {
    id: 'jabon',
    n: 'Jabones artesanales',
    c: 'Jabones',
    img: 'jabon',
    d: 'Cuidado corporal con un toque delicado. Avena y Miel nutre y suaviza; Arroz y Leche aporta luminosidad; Café y Canela exfolia suavemente; Coco y Oliva hidrata y protege.',
    a: ['Avena y Miel', 'Arroz y Leche', 'Café y Canela', 'Coco y Oliva'],
    v: U(8000)
  },
  {
    id: 'vela',
    n: 'Velas aromáticas',
    c: 'Velas',
    img: 'vela',
    d: 'Luz, aroma y calidez. Un detalle cálido para acompañar tus momentos en casa.',
    a: AV,
    v: [
      { n: 'Pequeña', p: 6000 },
      { n: 'Mediana', p: 8000 },
      { n: 'Grande', p: 10000 }
    ]
  },
  {
    id: 'melts',
    n: 'Wax melts',
    c: 'Wax melts',
    img: 'melts',
    d: 'Pequeñas piezas aromáticas para perfumar tus espacios.',
    a: AM,
    v: [
      { n: '5 unidades', p: 3000 },
      { n: '10 unidades', p: 7000 },
      { n: '15 unidades', p: 12000 },
      { n: '20 unidades', p: 16000 }
    ]
  },
  {
    id: 'sachet',
    n: 'Sachets aromáticos',
    c: 'Sachets',
    img: 'sachet',
    d: 'Piezas decorativas con flores para perfumar tus espacios.',
    a: AS,
    v: U(14000)
  },
  {
    id: 'pebetero',
    n: 'Pebetero',
    c: 'Pebeteros',
    img: 'pebetero',
    d: 'El complemento ideal para disfrutar tus wax melts en casa.',
    v: U(14000)
  },
  {
    id: 'k1',
    n: 'Kit Douceur',
    c: 'Kits',
    img: 'kitA',
    d: 'Un detalle pequeño y dulce. Incluye 1 jabón artesanal a elección y 5 wax melts a elección.',
    v: KV(24000, 10000),
    kit: 1
  },
  {
    id: 'k2',
    n: 'Kit Nuit',
    c: 'Kits',
    img: 'kitB',
    d: 'Calma para tu noche. Incluye 1 vela mediana de lavanda y 10 wax melts de lavanda.',
    v: KV(28000, 14000),
    kit: 1
  },
  {
    id: 'k3',
    n: 'Kit Fête',
    c: 'Kits',
    img: 'kitC',
    d: 'Magia navideña. Incluye 1 wax sachet Jingle bells, 10 wax melts Jingle bells y 1 vela pequeña de canela.',
    v: KV(38000, 24000),
    kit: 1
  },
  {
    id: 'k4',
    n: 'Kit Trío',
    c: 'Kits',
    img: 'jabon2',
    d: 'Para amantes del jabón. Incluye 3 jabones artesanales a elección.',
    v: [{ n: 'Por kit', p: 21000 }],
    kit: 1
  },
  {
    id: 'k5',
    n: 'Kit Maison',
    c: 'Kits',
    img: 'kitD',
    d: 'Aroma para tu hogar. Incluye 1 wax sachet a elección y 1 vela grande a elección.',
    v: [{ n: 'Por kit', p: 22000 }],
    kit: 1
  },
  {
    id: 'k6',
    n: 'Kit Rituel',
    c: 'Kits',
    img: 'kitE',
    d: 'El ritual completo. Incluye 2 jabones artesanales a elección, 1 vela mediana a elección y 10 wax melts a elección.',
    v: KV(42000, 28000),
    kit: 1
  }
];

/**
 * Fuente de productos (en la siguiente fase se reemplazará o complementará con Google Sheets).
 */
const loadProducts = () => Promise.resolve(PRODUCTS);