# ÂME Atelier – Sitio web (versión multipágina)

HTML, CSS y JavaScript puro. Sin instalaciones.

## Abrir
VS Code → extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.

## Páginas
`index.html` · `skin.html` · `collections.html` · `kits.html` · `nosotras.html` · `pedir.html`

## Archivos
```
css/styles.css          Colores (:root), diseño
js/config.js            WhatsApp, Instagram, vigencia de temporada  <- editar primero
js/data.js              Productos, precios, opciones y colecciones
js/utils.js             Funciones comunes y tarjeta/bloque de producto
js/cart.js              Carrito global (viaja entre páginas)
js/layout.js            Header, footer, carrito y WhatsApp (una sola vez para todas)
js/pages/*.js           Un archivo por página
img/                    Fotos (ver nombres abajo)
```
El orden de los `<script>` en cada HTML importa.

## Nombres de las fotos (minúsculas, sin tildes, .jpg)
- `img/marca/logo.png`
- `img/hero/hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg` (horizontales 1600×900)
- `img/skin/` avena-y-miel, arroz-y-leche, coco, cafe, carbon-activado
- `img/collections/` velas, wax-melts, sachets, pebeteros
- `img/kits/` petite-pause, les-trois, nuit-douce, douce-maison, rituel-dame, magie-de-noel, reve-de-noel, lumiere-de-noel
- Fotos extra de un producto: agrega `-2`, `-3` (ej. `petite-pause-2.jpg`); aparecen como miniaturas.
Si falta una foto, la página muestra un recuadro con el nombre.

## Tareas habituales
- Cambiar precio: `js/data.js`. Cada variante es `{o:{opción:valor}, p:precio}`.
- Esconder ediciones de temporada: quitar sus productos de `PRODUCTS` o cambiar `CONFIG.vigencia`.
- Aromas de velas y sachets: arreglo `AROMAS` en `js/data.js`.
