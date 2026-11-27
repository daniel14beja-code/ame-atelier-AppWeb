/* Lectura del catálogo desde Google Sheets (CSV) con caché y respaldo en data.js */
const CATALOG_CACHE_KEY = 'ame_catalog_cache_v2';
const CATALOG_TIMEOUT_MS = 4000;

function catalogReady(cb) {
  if (window.__AME_CATALOG_READY__) {
    cb();
    return;
  }
  window.addEventListener('ame:catalog-ready', cb, { once: true });
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\r' && next === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      i++;
    } else if (ch === '\n' || ch === '\r') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  if (!rows.length) return [];

  const headers = rows[0].map(h => h.trim().replace(/^\uFEFF/, ''));
  return rows.slice(1)
    .filter(r => r.some(c => c.trim() !== ''))
    .map(r => {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = (r[idx] ?? '').trim();
      });
      return obj;
    });
}

function parsePrecio(raw) {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : NaN;
  const cleaned = String(raw ?? '').replace(/[^0-9.,-]/g, '').replace(/\./g, '').replace(',', '.');
  const num = Number(cleaned);
  return Number.isFinite(num) && num > 0 ? num : NaN;
}

function splitPipe(val) {
  if (!val) return [];
  return String(val).split('|').map(s => s.trim()).filter(Boolean);
}

async function fetchCSVWithTimeout(url, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const sep = url.includes('?') ? '&' : '?';
    const res = await fetch(`${url}${sep}_ts=${Date.now()}`, { signal: ctrl.signal, cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function buildCatalogFromRows(prodRows, varRows) {
  const validCols = new Set(Object.keys(COLECCIONES || {}));
  const varsByProd = new Map();

  for (const vr of varRows) {
    const pid = vr.id_producto;
    const precio = parsePrecio(vr.precio);
    if (!pid || !Number.isFinite(precio)) {
      console.warn('[sheets.js] Variante ignorada por datos inválidos:', vr);
      continue;
    }
    const o = {};
    if (vr.opcion1 && vr.valor1) o[vr.opcion1] = vr.valor1;
    if (vr.opcion2 && vr.valor2) o[vr.opcion2] = vr.valor2;
    const v = { o, p: precio };
    if (!varsByProd.has(pid)) varsByProd.set(pid, []);
    varsByProd.get(pid).push(v);
  }

  const list = [];
  for (const pr of prodRows) {
    const activo = pr.activo === '' || pr.activo === undefined ? 1 : Number(pr.activo);
    if (activo === 0) continue;

    if (!pr.id || !pr.nombre || !validCols.has(pr.col || pr.coleccion)) {
      console.warn('[sheets.js] Producto ignorado por id, nombre o colección inválida:', pr);
      continue;
    }

    const id = pr.id;
    const col = pr.col || pr.coleccion;
    let variants = varsByProd.get(id) || [];
    if (!variants.length) {
      console.warn(`[sheets.js] Producto "${id}" ignorado por no tener variantes válidas.`);
      continue;
    }

    const inc = splitPipe(pr.incluye);
    const aromas = splitPipe(pr.aromas);
    if (aromas.length) {
      variants = variants.flatMap(x => aromas.map(a => ({ o: { ...x.o, Aroma: a }, p: x.p })));
    }

    const nota = pr.nota !== '' && pr.nota !== undefined ? (Number(pr.nota) ? 1 : 0) : ((col === 'essentiels' || col === 'editions' || id === 'velas' || id === 'wax-sachet' || id === 'sachets') ? 1 : 0);
    const orden = pr.orden !== '' && pr.orden !== undefined && Number.isFinite(Number(pr.orden)) ? Number(pr.orden) : 999;

    const item = {
      id,
      col,
      n: pr.nombre,
      d: pr.descripcion || '',
      v: variants,
      nota,
      _orden: orden
    };
    if (inc.length) item.inc = inc;
    if (col === 'essentiels' || col === 'editions') item.kit = 1;

    list.push(item);
  }

  list.sort((a, b) => a._orden - b._orden);
  return list.map(({ _orden, ...rest }) => rest);
}

function applyCatalog(newProducts) {
  if (!Array.isArray(newProducts) || !newProducts.length) return;
  PRODUCTS.length = 0;
  newProducts.forEach(p => PRODUCTS.push(p));
}

function saveCatalogCache(products) {
  try {
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({ ts: Date.now(), products }));
  } catch (_) {}
}

function loadCatalogCache() {
  try {
    const raw = localStorage.getItem(CATALOG_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.products) && parsed.products.length ? parsed.products : null;
  } catch (_) {
    return null;
  }
}

(async function initCatalog() {
  const sheetsCfg = (typeof CONFIG !== 'undefined' && CONFIG.sheets) ? CONFIG.sheets : {};
  const prodUrl = (sheetsCfg.productos || '').trim();
  const varUrl = (sheetsCfg.variantes || '').trim();

  const hasUrls =
    prodUrl && varUrl &&
    !prodUrl.includes('PEGA_AQUI') &&
    !varUrl.includes('PEGA_AQUI');

  if (hasUrls) {
    try {
      const [prodCsv, varCsv] = await Promise.all([
        fetchCSVWithTimeout(prodUrl, CATALOG_TIMEOUT_MS),
        fetchCSVWithTimeout(varUrl, CATALOG_TIMEOUT_MS)
      ]);
      const prodRows = parseCSV(prodCsv);
      const varRows = parseCSV(varCsv);
      const loaded = buildCatalogFromRows(prodRows, varRows);
      if (loaded.length) {
        applyCatalog(loaded);
        saveCatalogCache(loaded);
      } else {
        console.warn('[sheets.js] Las hojas no devolvieron productos válidos; usando respaldo.');
        const cached = loadCatalogCache();
        if (cached) applyCatalog(cached);
      }
    } catch (err) {
      console.warn('[sheets.js] Error al leer Google Sheets; usando caché o data.js:', err);
      const cached = loadCatalogCache();
      if (cached) applyCatalog(cached);
    }
  }

  window.__AME_CATALOG_READY__ = true;
  window.dispatchEvent(new Event('ame:catalog-ready'));
})();