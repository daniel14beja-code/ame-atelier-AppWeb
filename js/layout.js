/* Encabezado, pie, carrito (cajón) y botón de WhatsApp: se escriben una sola vez y se cargan en todas las páginas */
const NAV = [['index.html', 'Inicio', 'home'], ['skin.html', 'ÂME Skin', 'skin'], ['collections.html', 'Collections', 'collections'], ['kits.html', 'Kits', 'kits'], ['nosotras.html', 'Nosotras', 'nosotras'], ['pedir.html', 'Cómo pedir', 'pedir']];

const THEME_KEY = 'ame_theme';
function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (_) {
    return null;
  }
}
function setSavedTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {}
}
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    setSavedTheme('dark');
  } else {
    root.setAttribute('data-theme', 'light');
    setSavedTheme('light');
  }
}

applyTheme(getSavedTheme() === 'dark' ? 'dark' : 'light');

function syncCustomerFields() {
  const savedCustomer = typeof Cart.loadCustomer === 'function' ? Cart.loadCustomer() : {};
  const nameInput = $('#nm') || $('#c-name');
  const addressInput = $('#ad') || $('#c-address');

  if (nameInput && savedCustomer.name && !nameInput.value.trim()) {
    nameInput.value = savedCustomer.name;
  }
  if (addressInput && savedCustomer.address && !addressInput.value.trim()) {
    addressInput.value = savedCustomer.address;
  }
}

function buildLayout() {
  document.documentElement.classList.add('js');
  const cur = document.body.dataset.page;
  const themeBtnHTML = `<button type="button" class="theme-btn" id="tb" aria-label="Cambiar tema claro u oscuro"><svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M21 5h-4"/><path d="M17 9v2"/><path d="M18 10h-2"/></svg><svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></button>`;
  $('#site-header').outerHTML = `<header><div class="w"><a class="lg" href="index.html" aria-label="ÂME Atelier, inicio"><span>ÂME<small>ATELIER</small></span></a><nav id="nv" aria-label="Principal">${NAV.map(([h, t, k]) => `<a href="${h}" ${k === cur ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>${themeBtnHTML}<button class="btn2" id="oc" aria-label="Abrir carrito">Carrito (<span id="cn">0</span>)</button><button class="mb" id="mb" aria-label="Menú" aria-expanded="false" aria-controls="nv">☰</button></div></header>`;
  $('#site-footer').outerHTML = `<footer><div class="w fg"><div><h3>ÂME Atelier</h3><p>El arte de crear con el alma.</p></div><div><b>Explora</b>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div><div><b>Contacto</b><a href="${waUrl()}" target="_blank" rel="noopener">WhatsApp · ${CONFIG.telefono}</a><a href="https://instagram.com/${CONFIG.instagram}" target="_blank" rel="noopener">@${CONFIG.instagram}</a></div></div></footer>
<a class="wa" href="${waUrl(CONFIG.saludoInfo)}" target="_blank" rel="noopener">WhatsApp</a>
<dialog id="cart" aria-label="Tu pedido"><div class="cin"><div style="display:flex;justify-content:space-between;align-items:center"><h2 style="color:var(--rose)">Tu pedido</h2><button class="btn2" data-close>Cerrar</button></div><div class="cl" id="cl"></div><div style="display:flex;justify-content:space-between;font-size:18px"><b>Total</b><b class="pr" id="ct">$0</b></div><input class="i" id="nm" placeholder="Tu nombre" aria-label="Tu nombre" autocomplete="name"><input class="i" id="ad" placeholder="Tu dirección" aria-label="Tu dirección" autocomplete="street-address"><textarea class="i" id="nt" rows="2" placeholder="Notas adicionales (ej. fecha, portería, horario…)" aria-label="Notas adicionales del pedido"></textarea><button class="btn" id="sd">Enviar pedido por WhatsApp</button></div></dialog>`;
  Cart.load();
  Cart.render();
  syncCustomerFields();

  const persistCustomerInput = () => {
    Cart.saveCustomer($('#nm')?.value || '', $('#ad')?.value || '');
  };
  $('#nm').addEventListener('input', persistCustomerInput);
  $('#ad').addEventListener('input', persistCustomerInput);

  $('#tb').onclick = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  };
  $('#oc').onclick = () => {
    Cart.render();
    syncCustomerFields();
    $('#cart').showModal();
  };
  $('#mb').onclick = () => {
    const o = $('#nv').classList.toggle('open');
    $('#mb').setAttribute('aria-expanded', o);
  };
  $('#sd').onclick = () => {
    const nombre = ($('#nm')?.value || $('#c-name')?.value || '').trim();
    const direccion = ($('#ad')?.value || $('#c-address')?.value || '').trim();
    const notas = ($('#nt')?.value || $('#c-notes')?.value || '').trim();
    const texto = Cart.message(nombre, direccion, notas);
    const enlace = typeof waUrl === 'function'
      ? waUrl(texto)
      : `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
    window.open(enlace, '_blank', 'noopener');
  };
  $('#cart').addEventListener('click', e => {
    const t = e.target, b = t.closest('button'), d = b && b.dataset;
    if (t.id === 'cart' || (d && 'close' in d)) return $('#cart').close();
    if (d && d.d !== undefined) Cart.change(+d.d, -1); else if (d && d.u !== undefined) Cart.change(+d.u, 1); else if (d && d.r !== undefined) Cart.remove(+d.r);
  });
  addEventListener('storage', e => {
    if (e.key === THEME_KEY && e.newValue) {
      applyTheme(e.newValue);
    } else {
      Cart.load();
      Cart.render();
      syncCustomerFields();
    }
  });
}
buildLayout();
reveal();