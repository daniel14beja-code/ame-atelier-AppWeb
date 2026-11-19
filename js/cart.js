/* ==========================================================================
   Carrito de compras y envío de pedido por WhatsApp (js/cart.js)
   ========================================================================== */

/**
 * Calcula el precio unitario de una línea del carrito según su variante.
 */
function lineP(line) {
  const product = prod(line.id);
  return product ? product.v[line.vi].p : 0;
}

/**
 * Calcula el subtotal/total acumulado del carrito.
 */
function sum() {
  return cart.reduce((acc, line) => acc + lineP(line) * line.q, 0);
}

/**
 * Agrega el producto seleccionado (con opciones, cantidad y nota opcional) al carrito.
 */
function add() {
  const selected = sel();
  const noteInput = $('#kn');
  const note = noteInput ? noteInput.value.trim() : '';
  const key = [cur.id, selected.a, selected.vi, note].join('|');

  const existing = cart.find((line) => line.key === key);
  if (existing) {
    existing.q += qty;
  } else {
    cart.push({
      key,
      id: cur.id,
      a: selected.a,
      vi: selected.vi,
      nt: note,
      q: qty
    });
  }

  save();
  rc();
  $('#pd').close();
  toast('Agregado al carrito');
}

/**
 * Renderiza el contador del header, el contenido del carrito y el total.
 */
function rc() {
  const totalItems = cart.reduce((acc, line) => acc + line.q, 0);
  const hasItems = cart.length > 0;
  const sendBtn = $('#sd');

  $('#cn').textContent = totalItems;
  $('#ct').textContent = fmt(sum());
  sendBtn.disabled = !hasItems;
  sendBtn.style.opacity = hasItems ? 1 : 0.5;

  if (!hasItems) {
    $('#cl').innerHTML = '<p style="color:var(--mut)">Tu carrito está vacío. Elige un producto del catálogo.</p>';
    return;
  }

  $('#cl').innerHTML = cart
    .map((line, index) => {
      const product = prod(line.id);
      if (!product) return '';

      const variantName = product.v.length > 1 ? product.v[line.vi].n : '';
      const details = [line.a, variantName, line.nt].filter(Boolean).join(' · ');
      const lineTotal = fmt(lineP(line) * line.q);

      return `
        <div class="ln">
          <img src="${IMG[product.img]}" alt="">
          <div style="flex:1">
            <b>${esc(product.n)}</b>
            <div class="k" style="letter-spacing:.04em;text-transform:none">${esc(details)}</div>
            <div class="q">
              <button data-d="${index}" aria-label="Menos">−</button>
              <b>${line.q}</b>
              <button data-u="${index}" aria-label="Más">+</button>
            </div>
          </div>
          <div style="text-align:right">
            <span class="pr">${lineTotal}</span><br>
            <button class="k" style="background:none;border:0;min-height:44px" data-r="${index}">Quitar</button>
          </div>
        </div>
      `;
    })
    .join('');
}

/**
 * Construye el mensaje con el detalle del pedido y abre WhatsApp.
 */
function send() {
  const itemsText = cart
    .map((line) => {
      const product = prod(line.id);
      const variantName = product.v.length > 1 ? product.v[line.vi].n : '';
      const meta = [line.a, variantName, line.nt].filter(Boolean);
      const metaText = meta.length ? ` (${meta.join(', ')})` : '';
      return `• ${line.q}x ${product.n}${metaText} – ${fmt(lineP(line) * line.q)}`;
    })
    .join('\n');

  let message = `${CONFIG.saludo}\n\n${itemsText}\n\nTotal: ${fmt(sum())}`;

  const customerName = $('#nm').value.trim();
  const orderNotes = $('#nt').value.trim();

  if (customerName) message += `\nNombre: ${customerName}`;
  if (orderNotes) message += `\nNotas: ${orderNotes}`;

  window.open(waUrl(message), '_blank', 'noopener');
}