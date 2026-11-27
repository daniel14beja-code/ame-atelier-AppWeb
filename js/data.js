/* Catálogo. Cada producto tiene "v" (variantes): {o:{opción:valor}, p:precio}.
   Las opciones se muestran solas como botones. Fase Sheets: esta lista vendrá de una hoja. */
const AROMAS = ['Vainilla', 'Lavanda', 'Coco', 'Fiesta de flores', 'Limón-vainilla', 'Miel', 'Mango'];
const COLECCIONES = {
  skin: { n: 'ÂME Skin', k: 'Cuidado corporal', f: 'Pequeños cuidados para acompañar tu piel', href: 'skin.html', img: 'img/skin/avena-y-miel.jpg', dir: 'skin' },
  collections: { n: 'ÂME Collections', k: 'Aromas para el hogar', f: 'Aromas que transforman tus espacios', href: 'collections.html', img: 'img/collections/velas.jpg', dir: 'collections' },
  essentiels: { n: 'ÂME Essentiels', k: 'Para regalar', f: 'Colección permanente · Kits para regalar y regalarte', href: 'kits.html#essentiels', img: 'img/kits/petite-pause.jpg', dir: 'kits' },
  editions: { n: 'ÂME Éditions', k: 'Ediciones especiales', f: 'Colección de temporada · Detalles para compartir', href: 'kits.html#editions', img: 'img/kits/magie-de-noel.jpg', dir: 'kits' }
};
const conAroma = r => r.flatMap(x => AROMAS.map(a => ({ o: { ...x.o, Aroma: a }, p: x.p })));
const jab = ps => ['62 g', '63 g', '64 g', '106 g', '108 g', '123 g'].map((l, i) => ({ o: { Presentación: l }, p: ps[i] }));
const kit = (w, rows) => rows.flatMap(([g, s, c]) => [{ o: { ...(w ? { [w]: g } : {}), Pebetero: 'Sin pebetero' }, p: s }, { o: { ...(w ? { [w]: g } : {}), Pebetero: 'Con pebetero' }, p: c }]);
const PRODUCTS = [
  { id: 'avena-y-miel', col: 'skin', n: 'Avena y Miel', d: 'Jabón artesanal', v: jab([12200, 12300, 12300, 14500, 14600, 15200]) },
  { id: 'arroz-y-leche', col: 'skin', n: 'Arroz y Leche', d: 'Jabón artesanal', v: jab([12200, 12300, 12300, 14600, 14700, 15300]) },
  { id: 'coco', col: 'skin', n: 'Coco', d: 'Jabón artesanal', v: jab([12200, 12300, 12300, 14500, 14600, 15200]) },
  { id: 'cafe', col: 'skin', n: 'Café', d: 'Jabón artesanal', v: jab([13200, 13300, 13400, 14500, 14600, 17300]) },
  { id: 'carbon-activado', col: 'skin', n: 'Carbón Activado', d: 'Jabón artesanal', v: jab([14500, 14600, 14600, 17600, 17800, 18600]) },
  { id: 'velas', col: 'collections', n: 'Velas aromáticas', d: 'Un ambiente cálido y acogedor para tus momentos especiales.', v: conAroma([{ o: { Tamaño: 'Jr' }, p: 11800 }, { o: { Tamaño: 'Pequeña' }, p: 13100 }, { o: { Tamaño: 'Mediana' }, p: 19700 }, { o: { Tamaño: 'Grande' }, p: 33600 }]) },
  { id: 'wax-melts', col: 'collections', n: 'Wax melts', d: 'Pequeñas piezas aromáticas para perfumar tus espacios.', v: [{ o: { Cantidad: 'X5' }, p: 3000 }, { o: { Cantidad: 'X10' }, p: 7000 }, { o: { Cantidad: 'X15' }, p: 11000 }, { o: { Cantidad: 'X20' }, p: 15000 }] },
  { id: 'wax-sachet', col: 'collections', n: 'Wax sachets', d: 'Piezas decorativas para perfumar tus espacios.', v: conAroma([{ o: {}, p: 14000 }]) },
  { id: 'pebeteros', col: 'collections', n: 'Pebeteros', d: 'El complemento ideal para disfrutar tus wax melts.', v: [{ o: {}, p: 20000 }] },
  { id: 'petite-pause', col: 'essentiels', n: 'Petite Pause', inc: ['1 jabón artesanal (62–64 g o 106–123 g)', '5 wax melts'], kit: 1, v: kit('Jabón', [['62–64 g', 12500, 28500], ['106–123 g', 15500, 31500]]) },
  { id: 'les-trois', col: 'essentiels', n: 'Les Trois', inc: ['3 jabones artesanales'], kit: 1, v: [{ o: { Jabones: '62–64 g' }, p: 28500 }, { o: { Jabones: '106–123 g' }, p: 37500 }] },
  { id: 'nuit-douce', col: 'essentiels', n: 'Nuit Douce', inc: ['1 vela mediana', '10 wax melts'], kit: 1, v: kit('', [['', 22500, 38500]]) },
  { id: 'douce-maison', col: 'essentiels', n: 'Douce Maison', inc: ['1 wax sachet', '1 vela grande'], kit: 1, v: [{ o: {}, p: 39000 }] },
  { id: 'rituel-dame', col: 'essentiels', n: 'Rituel d’Âme', inc: ['2 jabones', '1 vela mediana', '10 wax melts'], kit: 1, v: kit('Jabones', [['62–64 g', 41500, 57500], ['106–123 g', 47500, 63500]]) },
  { id: 'magie-de-noel', col: 'editions', n: 'Magie de Noël', inc: ['1 wax sachet', '10 wax melts', '1 pebetero'], kit: 1, v: kit('', [['', 26500, 42500]]) },
  { id: 'reve-de-noel', col: 'editions', n: 'Rêve de Noël', inc: ['Jabón navideño', 'Vela mediana', '15 wax melts'], kit: 1, v: kit('Jabón', [['62–64 g', 29000, 45000], ['106–123 g', 32000, 48000]]) },
  { id: 'lumiere-de-noel', col: 'editions', n: 'Lumière de Noël', d: 'Velitas navideñas para iluminar tus celebraciones.', kit: 1, v: [{ o: { Presentación: '4 velitas' }, p: 16000 }, { o: { Presentación: '4 velitas con diseño de llama' }, p: 18000 }, { o: { Presentación: '6 velitas en caja' }, p: 18000 }] }
];
/* Nombres de las fotos: img/<carpeta>/<id>.jpg  (extras: <id>-2.jpg, <id>-3.jpg) */
const imgOf = p => `img/${COLECCIONES[p.col].dir}/${p.id}.jpg`;
const dimsOf = p => Object.keys(p.v[0].o).map(k => ({ k, vals: [...new Set(p.v.map(x => x.o[k]))] }));
const findV = (p, sel) => p.v.find(x => Object.keys(x.o).every(k => x.o[k] === sel[k]));
const minP = p => Math.min(...p.v.map(x => x.p));
const byId = id => PRODUCTS.find(p => p.id === id);
