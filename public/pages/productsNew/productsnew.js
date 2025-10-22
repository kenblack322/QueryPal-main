// Float-orbit animation that preserves original absolute positions and runs only > 479px
(() => {
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const mq = window.matchMedia('(min-width: 480px)'); // run only on screens > 479px
  const TWO_PI = Math.PI * 2;

  let rafId = null;
  const items = [];

  function collect() {
    items.length = 0;
    document.querySelectorAll('.float-orbit').forEach(el => {
      const cs = getComputedStyle(el);
      const originalTransform = cs.transform === 'none' ? '' : cs.transform;

      const radius = parseFloat(el.dataset.radius) || (10 + Math.random() * 18);
      const speed  = parseFloat(el.dataset.speed)  || (6 + Math.random() * 6); // seconds per orbit
      const dirStr = (el.dataset.dir || (Math.random() < 0.5 ? 'cw' : 'ccw')).toLowerCase();
      const dir    = dirStr === 'ccw' ? -1 : 1;
      const phase  = ('phase' in el.dataset) ? (parseFloat(el.dataset.phase) * Math.PI / 180) : Math.random() * TWO_PI;
      const wobble = 3 + Math.random() * 4; // deg

      // Ensure GPU-friendly
      el.style.willChange = 'transform';

      items.push({ el, originalTransform, radius, speed, dir, phase, wobble });
    });
  }

  let t0 = null;
  function loop(ts) {
    if (t0 == null) t0 = ts;
    const t = (ts - t0) / 1000;

    for (const it of items) {
      const ang = it.phase + it.dir * (t / it.speed) * TWO_PI;
      const x = Math.cos(ang) * it.radius;
      const y = Math.sin(ang) * it.radius;
      const r = Math.sin(ang) * it.wobble;

      // Compose with original transform so absolute elements keep their place
      it.el.style.transform = `${it.originalTransform} translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`.trim();
    }
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    stop();
    collect();
    if (!items.length) return;
    t0 = null;
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    // Reset transforms to original
    items.forEach(it => {
      it.el.style.transform = it.originalTransform;
      it.el.style.willChange = '';
    });
    items.length = 0;
  }

  function apply() {
    if (mq.matches) start();
    else stop();
  }

  // Run once DOM is ready (images not required since we don't wrap/measure)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }

  // React to viewport changes
  mq.addEventListener?.('change', apply);
  window.addEventListener('resize', () => {
    // Optional: debounce if your page resizes a lot
    apply();
  });
})();

function feedbackSlider() {
  // Инициализируем свайпер только на мобильных устройствах (до 479px)
  if (window.innerWidth > 479) {
    return;
  }

  // Ищем все элементы с классом swiper
  const swiperElements = document.querySelectorAll('.swiper');
  
  swiperElements.forEach(element => {
    new Swiper(element, {
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerGroup: 1,

      observer: true,
      observeParents: true,

      grabCursor: false,
      a11y: false,
      allowTouchMove: true,

      loop: true,
      speed: 600,

      autoplay: {
        delay: 10000,
      },

      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },

      pagination: {
        el: '.feedback__pagination',
        type: 'bullets',
        clickable: true,
        bulletClass: 'feedback-bullet',
        bulletActiveClass: 'feedback-bullet-active',
      },
    });
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// ADAPTIVES /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// Инициализация свайпера
feedbackSlider();

// Обработка изменения размера окна
window.addEventListener('resize', function() {
  // Деинициализируем все существующие свайперы
  const swiperElements = document.querySelectorAll('.swiper');
  swiperElements.forEach(element => {
    if (element.swiper) {
      element.swiper.destroy(true, true);
    }
  });
  
  // Переинициализируем если нужно
  feedbackSlider();
});
