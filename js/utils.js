/* Utilidades compartidas */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => '$' + n.toLocaleString('es-CO');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const waUrl = t => `https://wa.me/${CONFIG.whatsapp}${t ? '?text=' + encodeURIComponent(t) : ''}`;
function ph(alt) { const d = document.createElement('div'); d.className = 'ph'; d.textContent = alt; return d }
const imgTag = (src, alt, cls = '') => `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.replaceWith(ph(this.alt))">`;
function toast(m) { let t = $('#ts'); if (!t) { t = document.createElement('div'); t.id = 'ts'; t.className = 'ts'; t.setAttribute('role', 'status'); document.body.append(t) } t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2200) }
function reveal() {
  const items = $$('.rv:not(.in)'); if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion:reduce)').matches) { items.forEach(e => e.classList.add('in')); return }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 }); items.forEach(e => io.observe(e))
}
/* Tarjeta o bloque de producto con selector de opciones, cantidad y botón agregar */
function productHTML(p, type) {
  const dims = dimsOf(p), col = COLECCIONES[p.col];
  const opts = dims.map(d => `<fieldset><legend>${esc(d.k)}</legend><div class="op">${d.vals.map((v, i) => `<label><input type="radio" name="${p.id}-${esc(d.k)}" data-k="${esc(d.k)}" value="${esc(v)}" ${i ? '' : 'checked'}>${esc(v)}</label>`).join('')}</div></fieldset>`).join('');
  const inc = p.inc ? `<p class="k" style="margin:0">Incluye</p><ul class="inc">${p.inc.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : '';
  const note = p.kit || p.id === 'velas' || p.id === 'sachets' ? `<label class="vh" for="n-${p.id}">Notas</label><input class="i" id="n-${p.id}" data-note placeholder="Notas: detalles, aromas a elección…">` : '';
  return `<article class="${type} rv" id="${p.id}" data-id="${p.id}"><div class="bm"><div class="bi">${imgTag(imgOf(p), p.n)}</div><div class="th"></div></div><div class="bb"><span class="k">${esc(col.n)}</span><h3>${esc(p.n)}</h3>${p.d ? `<p class="s">${esc(p.d)}</p>` : ''}${inc}${opts}${note}<div class="bf"><div class="q"><button data-m aria-label="Menos">−</button><b data-q>1</b><button data-p aria-label="Más">+</button></div><span class="pr" data-pr></span><button class="btn" data-add>Agregar</button></div></div></article>`
}
function bindProducts(root = document) {
  $$('[data-id]', root).forEach(a => {
    const p = byId(a.dataset.id); let q = 1;
    const sel = () => Object.fromEntries($$('input[data-k]:checked', a).map(i => [i.dataset.k, i.value]));
    const upd = () => { const v = findV(p, sel()); $('[data-q]', a).textContent = q; $('[data-pr]', a).textContent = v ? fmt(v.p * q) : '' };
    a.addEventListener('change', upd);
    $('[data-m]', a).onclick = () => { q = Math.max(1, q - 1); upd() }; $('[data-p]', a).onclick = () => { q++; upd() };
    $('[data-add]', a).onclick = () => { const n = $('[data-note]', a); Cart.add(p.id, sel(), q, n ? n.value.trim() : ''); toast(p.n + ' agregado al carrito'); q = 1; upd() };
    upd();
    [2, 3].forEach(n => { const im = new Image(), src = imgOf(p).replace('.jpg', `-${n}.jpg`); im.onload = () => { const b = document.createElement('button'); b.className = 'tb'; b.setAttribute('aria-label', 'Ver foto ' + n); b.innerHTML = `<img src="${src}" alt="">`; b.onclick = () => { const m = $('.bi img', a); if (m) m.src = src }; $('.th', a).append(b) }; im.src = src })
  });
}
