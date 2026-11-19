/* ==========================================================================
   Carrusel principal / Hero slider (js/slider.js)
   ========================================================================== */

let si = 0;
let st;

/**
 * Cambia a la diapositiva indicada y actualiza la posición y los indicadores.
 */
const go = (index) => {
  si = (index + SL.length) % SL.length;
  $('#tr').style.transform = `translateX(-${si * 100}%)`;

  [...$('#dt').children].forEach((dotBtn, idx) => {
    dotBtn.setAttribute('aria-current', idx === si);
  });
};

/**
 * Renderiza las diapositivas y configura controles táctiles, botones y autoplay.
 */
function slider() {
  $('#tr').innerHTML = SL.map(
    (slide, idx) => `
      <div class="sl" role="group" aria-label="${idx + 1} de ${SL.length}" style="background-image:url(${IMG[slide.i]})">
        <div>
          <span class="k" style="color:#fff">${esc(slide.k)}</span>
          <h2>${esc(slide.t)}</h2>
          <p>${esc(slide.p)}</p>
          <button class="btn" data-cat="${esc(slide.c)}">Ver ${esc(slide.c.toLowerCase())}</button>
        </div>
      </div>
    `
  ).join('');

  $('#dt').innerHTML = SL.map(
    (_, idx) => `<button aria-label="Ir a la diapositiva ${idx + 1}"><i></i></button>`
  ).join('');

  [...$('#dt').children].forEach((dotBtn, idx) => {
    dotBtn.onclick = () => {
      go(idx);
      play();
    };
  });

  $('#pv').onclick = () => {
    go(si - 1);
    play();
  };

  $('#nx').onclick = () => {
    go(si + 1);
    play();
  };

  /* Soporte para gesto táctil (swipe horizontal) en móviles */
  let startX = null;
  const hero = $('.hero');

  hero.ontouchstart = (event) => {
    startX = event.touches[0].clientX;
  };

  hero.ontouchend = (event) => {
    if (startX === null) return;
    const deltaX = event.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) > 40) {
      go(si + (deltaX < 0 ? 1 : -1));
      play();
    }
    startX = null;
  };

  /* Pausa y reanudación automática al interactuar con el carrusel */
  hero.onmouseenter = () => clearInterval(st);
  hero.onmouseleave = play;

  go(0);
  play();
}

/**
 * Inicia el avance automático si el usuario no prefiere movimiento reducido.
 */
function play() {
  clearInterval(st);
  if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
    st = setInterval(() => go(si + 1), 5500);
  }
}