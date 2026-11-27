/* Inicio: slider, colecciones, cuenta regresiva y buscador de regalo */
const SL = [{ img: 'img/hero/hero-1.jpg', k: 'ÂME Skin', t: 'Pequeños cuidados para acompañar tu piel', h: 'skin.html', c: 'Ver jabones' }, { img: 'img/hero/hero-2.jpg', k: 'ÂME Collections', t: 'Aromas que transforman tus espacios', h: 'collections.html', c: 'Ver colección' }, { img: 'img/hero/hero-3.jpg', k: 'ÂME Éditions', t: 'Detalles para compartir esta temporada', h: 'kits.html#editions', c: 'Ver ediciones' }];
let si = 0, st;
function go(n) { si = (n + SL.length) % SL.length; $('#tr').style.transform = `translateX(-${si * 100}%)`; $$('#dt button').forEach((b, k) => b.setAttribute('aria-current', k === si)) }
function play() { clearInterval(st); if (!matchMedia('(prefers-reduced-motion:reduce)').matches) st = setInterval(() => go(si + 1), 5500) }
$('#tr').innerHTML = SL.map((s, k) => `<div class="sl" role="group" aria-label="${k + 1} de ${SL.length}" style="background-image:url('${s.img}')"><div><span class="k" style="color:#fff">${esc(s.k)}</span><h2>${esc(s.t)}</h2><a class="btn" href="${s.h}">${esc(s.c)}</a></div></div>`).join('');
$('#dt').innerHTML = SL.map((s, k) => `<button aria-label="Ir a la diapositiva ${k + 1}"><i></i></button>`).join('');
$$('#dt button').forEach((b, k) => b.onclick = () => { go(k); play() }); $('#pv').onclick = () => { go(si - 1); play() }; $('#nx').onclick = () => { go(si + 1); play() };
let x0 = null; const hero = $('.hero'); hero.ontouchstart = e => x0 = e.touches[0].clientX; hero.ontouchend = e => { if (x0 === null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) { go(si + (d < 0 ? 1 : -1)); play() } x0 = null };
hero.onmouseenter = () => clearInterval(st); hero.onmouseleave = play; go(0); play();
/* Colecciones */
$('#cols').innerHTML = Object.values(COLECCIONES).map(c => `<a class="cc rv" href="${c.href}"><div class="bi">${imgTag(c.img, c.n)}</div><div class="ct"><span class="k">${esc(c.k)}</span><h3>${esc(c.n)}</h3><p class="s">${esc(c.f)}</p></div></a>`).join('');
/* Cuenta regresiva de temporada */
(function () {
  const n = new Date(), end = new Date(n.getFullYear(), CONFIG.vigencia.mes - 1, CONFIG.vigencia.dia, 23, 59, 59); if (end < n) return; $('#ban').hidden = false;
  const t = () => { const d = Math.max(0, end - new Date()), u = [['días', 864e5], ['horas', 36e5], ['min', 6e4], ['seg', 1e3]]; let r = d; $('#cdn').innerHTML = u.map(([l, m]) => { const v = Math.floor(r / m); r -= v * m; return `<div><b>${String(v).padStart(2, '0')}</b><span>${l}</span></div>` }).join('') }; t(); setInterval(t, 1000)
})();
/* Buscador de regalo */
const QZ = { 'Para mí': ['petite-pause', 'nuit-douce', 'rituel-dame'], 'Para regalar': ['petite-pause', 'douce-maison', 'les-trois'], 'Para mi hogar': ['douce-maison', 'nuit-douce'], 'Navidad': ['magie-de-noel', 'reve-de-noel', 'lumiere-de-noel'] };
$('#qz').innerHTML = Object.keys(QZ).map(q => `<button class="chip" aria-pressed="false" data-q="${esc(q)}">${esc(q)}</button>`).join('');
$('#qz').onclick = e => {
  const b = e.target.closest('[data-q]'); if (!b) return; $$('#qz .chip').forEach(c => c.setAttribute('aria-pressed', c === b));
  $('#qr').innerHTML = QZ[b.dataset.q].map(id => { const p = byId(id); return `<a class="cd in" href="kits.html#${p.id}"><div class="bi">${imgTag(imgOf(p), p.n)}</div><div class="bb"><span class="k">${esc(COLECCIONES[p.col].n)}</span><h3>${esc(p.n)}</h3><span class="pr">Desde ${fmt(minP(p))}</span></div></a>` }).join('')
};
reveal();
