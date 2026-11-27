/* ÂME Collections: un bloque por producto, uno debajo del otro */
$('#stk').innerHTML = '<p class="s">Cargando catálogo…</p>';
catalogReady(() => {
  $('#stk').innerHTML = PRODUCTS.filter(p => p.col === 'collections').map(p => productHTML(p, 'blk')).join('');
  bindProducts($('#stk'));
  reveal();
});