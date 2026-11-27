/* Carrito global (se guarda en el navegador y viaja entre páginas) */
const Cart = {
  items: [], key: 'ame_cart_v2',
  load() { try { this.items = JSON.parse(localStorage.getItem(this.key) || '[]') } catch (e) { this.items = [] } },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.items)) } catch (e) { } this.render() },
  price(l) { const p = byId(l.id), v = p && findV(p, l.sel); return v ? v.p : 0 },
  count() { return this.items.reduce((s, l) => s + l.q, 0) },
  total() { return this.items.reduce((s, l) => s + this.price(l) * l.q, 0) },
  detail(l) { return [...Object.values(l.sel), l.nt].filter(Boolean).join(', ') },
  add(id, sel, q, nt) { const key = [id, JSON.stringify(sel), nt].join('|'), f = this.items.find(l => l.key === key); f ? f.q += q : this.items.push({ key, id, sel, nt, q }); this.save() },
  change(i, d) { const l = this.items[i]; l.q += d; if (l.q < 1) this.items.splice(i, 1); this.save() },
  remove(i) { this.items.splice(i, 1); this.save() },
  message(name, notes) {
    let m = CONFIG.saludo + '\n\n' + this.items.map(l => { const p = byId(l.id), d = this.detail(l); return `• ${l.q}x ${p.n}${d ? ' (' + d + ')' : ''} – ${fmt(this.price(l) * l.q)}` }).join('\n') + `\n\nTotal: ${fmt(this.total())}`;
    if (name) m += `\nNombre: ${name}`; if (notes) m += `\nNotas: ${notes}`; return m
  },
  render() {
    const n = $('#cn'); if (!n) return; n.textContent = this.count(); $('#ct').textContent = fmt(this.total()); const s = $('#sd'); s.disabled = !this.items.length; s.style.opacity = this.items.length ? 1 : .5;
    $('#cl').innerHTML = this.items.length ? this.items.map((l, i) => { const p = byId(l.id); if (!p) return ''; return `<div class="ln"><div class="lt">${imgTag(imgOf(p), p.n)}</div><div style="flex:1"><b>${esc(p.n)}</b><div class="s">${esc(this.detail(l))}</div><div class="q"><button data-d="${i}" aria-label="Menos">−</button><b>${l.q}</b><button data-u="${i}" aria-label="Más">+</button></div></div><div style="text-align:right"><span class="pr">${fmt(this.price(l) * l.q)}</span><br><button class="rm" data-r="${i}">Quitar</button></div></div>` }).join('') : '<p class="s">Tu carrito está vacío. Elige un producto de las colecciones.</p>'
  }
};
