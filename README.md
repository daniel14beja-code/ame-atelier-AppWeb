# ÂME Atelier – Sitio web

Catálogo con carrito que envía el pedido por WhatsApp. HTML, CSS y JavaScript puro, sin instalaciones.

## Cómo abrirlo
- VS Code → extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.
- También funciona abriendo `index.html` directamente en el navegador.

## Estructura
```
index.html        Estructura de la página
css/styles.css    Colores (:root), tipografía y diseño
js/config.js      Número de WhatsApp, nombre y saludo  <- editar primero
js/data.js        Imágenes, categorías, slider y productos
js/utils.js       Funciones de apoyo y estado (carrito guardado en el navegador)
js/slider.js      Carrusel de portada
js/catalog.js     Catálogo, filtros y ventana de detalle
js/cart.js        Carrito y mensaje de WhatsApp
js/main.js        Eventos e inicio
img/              Fotos de los productos
```
El orden de los `<script>` en `index.html` importa: respeta el orden de la lista.

## Tareas habituales
- **Poner el WhatsApp:** `js/config.js` → `whatsapp:'57XXXXXXXXXX'`.
- **Cambiar un precio o producto:** `js/data.js` → arreglo `PRODUCTS`.
- **Agregar una foto:** guardarla en `img/` y registrarla en el objeto `IMG` de `js/data.js`.
- **Cambiar colores:** `css/styles.css`, variables al inicio.

## Hoja de ruta
1. Fase 1 (hecha): diseño, slider, catálogo, carrito y pedido por WhatsApp.
2. Fase 2: leer productos desde Google Sheets (reemplaza `loadProducts` en `js/data.js`).
3. Fase 3: formulario de pedido completo (fecha, dirección, mensaje de tarjeta).
4. Fase 4: preguntas frecuentes, cómo pagar, dominio propio.

## Publicar gratis
Sube la carpeta a un repositorio de GitHub y conéctalo a Cloudflare Pages o Netlify (sin comando de build; carpeta de salida: raíz).
