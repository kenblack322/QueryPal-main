'use strict';

(function () {
  let swiper1 = null;
  let swiper2 = null;

  const mq = window.matchMedia('(max-width: 479px)');

  function createSwipers() {
    if (typeof Swiper === 'undefined') return;

    if (!swiper1 && document.querySelector('#basic-swiper')) {
      swiper1 = new Swiper('#basic-swiper', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        a11y: false,
        allowTouchMove: false,
        centeredSlides: true,
        centeredSlidesBounds: true,
        loop: true,
        navigation: { nextEl: '#right-button', prevEl: '#left-button' },
      });
    }

    if (!swiper2 && document.querySelector('#basic-swiper-second')) {
      swiper2 = new Swiper('#basic-swiper-second', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        a11y: false,
        spaceBetween: 10,
        allowTouchMove: false,
        centeredSlides: true,
        centeredSlidesBounds: true,
        loop: true,
        navigation: { nextEl: '#right-button-second', prevEl: '#left-button-second' },
      });
    }
  }

  function destroySwipers() {
    if (swiper1) {
      swiper1.destroy(true, true);
      swiper1 = null;
    }
    if (swiper2) {
      swiper2.destroy(true, true);
      swiper2 = null;
    }
  }

  function syncWithMediaQuery() {
    if (mq.matches) {
      createSwipers();
    } else {
      destroySwipers();
    }
  }

  function bootstrap() {
    // Ждём DOM и (по возможности) глобальный Swiper
    const start = () => {
      if (!mq.matches) {
        destroySwipers();
        return;
      }
      if (typeof Swiper !== 'undefined') {
        createSwipers();
      } else {
        // Мягко ждём до 5с появления Swiper, только для mobile-брейкпоинта
        let tries = 0;
        const t = setInterval(() => {
          tries++;
          if (!mq.matches) {
            clearInterval(t);
            destroySwipers();
            return;
          }
          if (typeof Swiper !== 'undefined') {
            clearInterval(t);
            createSwipers();
          } else if (tries > 100) {
            clearInterval(t);
            console.error('[industry.js] Swiper не найден (CDN?).');
          }
        }, 50);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }

    // Реагируем на смену брейкпоинта
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', syncWithMediaQuery);
    } else if (typeof mq.addListener === 'function') { // Safari старых версий
      mq.addListener(syncWithMediaQuery);
    }
  }

  bootstrap();
})();