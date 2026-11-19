/* ==========================================================================
   Eventos globales e inicialización de la aplicación (js/main.js)
   ========================================================================== */

const THEME_KEY = 'ame_theme';
const rootEl = document.documentElement;
const themeBtn = $('#tm');

/**
 * Aplica el tema ('dark' por defecto o 'light') y actualiza el botón y localStorage.
 */
function applyTheme(theme) {
  const isLight = theme === 'light';
  rootEl.setAttribute('data-theme', isLight ? 'light' : 'dark');

  if (themeBtn) {
    const label = isLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro';
    themeBtn.setAttribute('aria-label', label);
    themeBtn.setAttribute('title', label);
  }

  try {
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  } catch (e) {
    // Ignorar errores de almacenamiento (ej. modo privado restringido)
  }
}

const savedTheme = (() => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (e) {
    return null;
  }
})();

applyTheme(savedTheme === 'light' ? 'light' : 'dark');

if (themeBtn) {
  themeBtn.onclick = () => {
    const nextTheme = rootEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  };
}

/**
 * Delegación de eventos de clic para botones, filtros, modales, carrito y backdrop.
 */
document.addEventListener('click', (event) => {
  const target = event.target.closest('button, dialog');
  if (!target) return;

  const data = target.dataset || {};

  if (data.cat) {
    setCat(data.cat);
    $('#catalogo').scrollIntoView();
  } else if (data.f) {
    setCat(data.f);
  } else if (data.p) {
    openP(data.p);
  } else if ('close' in data) {
    target.closest('dialog').close();
  } else if (data.d !== undefined) {
    const index = +data.d;
    const line = cart[index];
    if (line.q > 1) {
      line.q--;
    } else {
      cart.splice(index, 1);
    }
    save();
    rc();
  } else if (data.u !== undefined) {
    cart[+data.u].q++;
    save();
    rc();
  } else if (data.r !== undefined) {
    cart.splice(+data.r, 1);
    save();
    rc();
  } else if (target.tagName === 'DIALOG' && event.target === target) {
    target.close();
  }
});

/* Controles directos de modales, cantidad, carrito y WhatsApp */
$('#oc').onclick = () => $('#cart').showModal();
$('#m1').onclick = () => {
  qty = Math.max(1, qty - 1);
  tot();
};
$('#p1').onclick = () => {
  qty++;
  tot();
};
$('#ad').onclick = add;
$('#sd').onclick = send;

$('#wb').href = $('#fw').href = waUrl(
  CONFIG.saludo.replace('este pedido', 'información')
);

/* Arranque de la aplicación */
loadProducts().then((products) => {
  P = products;
  slider();
  chips();
  grid();
  rc();
});