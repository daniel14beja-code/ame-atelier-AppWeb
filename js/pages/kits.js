/* Kits: dos grupos (Essentiels y Éditions), cada kit en su bloque */
$('#kg').innerHTML=['essentiels','editions'].map(c=>`<div class="grp" id="${c}"><div class="hd rv"><span class="k">${esc(COLECCIONES[c].k)}</span><h2>${esc(COLECCIONES[c].n)}</h2><p>${esc(COLECCIONES[c].f)}</p></div><div class="stk">${PRODUCTS.filter(p=>p.col===c).map(p=>productHTML(p,'blk')).join('')}</div></div>`).join('');
bindProducts($('#kg'));reveal();
if(location.hash){const t=document.getElementById(location.hash.slice(1));t&&setTimeout(()=>t.scrollIntoView(),50)}
