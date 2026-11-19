/* ==========================================================================
   Utilidades, estado global y helpers (js/utils.js)
   ========================================================================== */

/* Selectores, formato de moneda y escape básico contra inyección HTML */
const $ = (selector) => document.querySelector(selector);
const fmt = (amount) => '$' + amount.toLocaleString('es-CO');
const esc = (str) =>
  String(str).replace(/[&<>"]/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char])
  );

/* Estado global de la aplicación */
let P = [];
let cart = [];
let cat = 'Todos';
let cur = null;
let qty = 1;

/* Carga y guardado del carrito en localStorage */
try {
  cart = JSON.parse(localStorage.getItem('ame_cart') || '[]');
} catch (error) {
  cart = [];
}

const save = () => {
  try {
    localStorage.setItem('ame_cart', JSON.stringify(cart));
  } catch (error) {
    // Ignorar errores de almacenamiento (ej. modo privado restringido)
  }
};

/* Helpers de búsqueda de producto, notificación toast y enlace de WhatsApp */
const prod = (id) => P.find((item) => item.id === id);

const toast = (message) => {
  const el = $('#ts');
  el.textContent = message;
  el.classList.add('on');
  setTimeout(() => el.classList.remove('on'), 2200);
};

const waUrl = (text) =>
  `https://wa.me/${CONFIG.whatsapp}${text ? '?text=' + encodeURIComponent(text) : ''}`;