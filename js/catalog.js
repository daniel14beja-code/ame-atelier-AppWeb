/* ==========================================================================
   Catálogo, filtros y detalle de producto (js/catalog.js)
   ========================================================================== */

/**
 * Renderiza los botones de filtro por categoría.
 */
function chips() {
  const categories = ['Todos', ...CATS];
  $('#ch').innerHTML = categories
    .map(
      (category) =>
        `<button class="chip" aria-pressed="${category === cat}" data-f="${esc(category)}">${esc(category)}</button>`
    )
    .join('');
}

/**
 * Renderiza la cuadrícula de productos filtrados según la categoría activa.
 */
function grid() {
  const filtered = P.filter((product) => cat === 'Todos' || product.c === cat);

  $('#gr').innerHTML = filtered
    .map((product) => {
      const minPrice = Math.min(...product.v.map((variant) => variant.p));
      const priceLabel = `${product.v.length > 1 ? 'Desde ' : ''}${fmt(minPrice)}`;

      return `
        <button class="cd" data-p="${product.id}" aria-label="Ver ${esc(product.n)}">
          <img src="${IMG[product.img]}" alt="${esc(product.n)}" loading="lazy">
          <div>
            <span class="k">${esc(product.c)}</span>
            <h3>${esc(product.n)}</h3>
            <span class="pr">${priceLabel}</span>
          </div>
        </button>
      `;
    })
    .join('');
}

/**
 * Cambia la categoría activa y actualiza filtros y catálogo.
 */
function setCat(category) {
  cat = category;
  chips();
  grid();
}

/**
 * Genera un grupo de opciones tipo radio button para el modal de producto.
 */
const grp = (label, name, items) => `
  <fieldset>
    <legend>${label}</legend>
    <div class="op">
      ${items
        .map(
          (text, index) => `
            <label>
              <input type="radio" name="${name}" value="${index}" ${index ? '' : 'checked'}>
              ${esc(text)}
            </label>
          `
        )
        .join('')}
    </div>
  </fieldset>
`;

/**
 * Abre el modal con el detalle y opciones del producto seleccionado.
 */
function openP(id) {
  cur = prod(id);
  qty = 1;

  $('#pi').src = IMG[cur.img];
  $('#pi').alt = cur.n;
  $('#pc').textContent = cur.c;
  $('#pt').textContent = cur.n;
  $('#pdsc').textContent = cur.d;

  const aromaGroup = cur.a ? grp('Aroma', 'a', cur.a) : '';
  const variantGroup =
    cur.v.length > 1
      ? grp(
          cur.kit ? 'Versión' : 'Tamaño',
          'v',
          cur.v.map((variant) => `${variant.n} · ${fmt(variant.p)}`)
        )
      : '';

  $('#po').innerHTML = aromaGroup + variantGroup;
  $('#pn').innerHTML = cur.kit
    ? '<label class="vh" for="kn">Notas del kit</label><input class="i" id="kn" placeholder="Aromas o jabones a elección">'
    : '';

  $('#po').oninput = tot;
  tot();
  $('#pd').showModal();
}

/**
 * Obtiene el aroma y el índice de variante seleccionados en el modal.
 */
const sel = () => ({
  a: cur.a
    ? cur.a[+(document.querySelector('input[name=a]:checked') || { value: 0 }).value]
    : '',
  vi: +(document.querySelector('input[name=v]:checked') || { value: 0 }).value
});

/**
 * Actualiza la cantidad visible y el precio total en el modal.
 */
function tot() {
  $('#qv').textContent = qty;
  $('#pp').textContent = fmt(cur.v[sel().vi].p * qty);
}