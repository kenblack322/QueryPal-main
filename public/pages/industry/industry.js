'use strict';

(function () {
  let swiper1 = null;
  let swiper2 = null;

  function initBasicSwipers() {
    if (typeof Swiper === 'undefined') return;

    if (window.innerWidth > 479) {
      if (swiper1) {
        swiper1.destroy(true, true);
        swiper1 = null;
      }
      if (swiper2) {
        swiper2.destroy(true, true);
        swiper2 = null;
      }
      console.log('Swiper instances destroyed because window width is greater than 479px.');
      return;
    }

    if (!swiper1) {
      swiper1 = new Swiper('#basic-swiper', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        a11y: false,
        allowTouchMove: false,
        centeredSlides: true,
        centeredSlidesBounds: true,
        loop: true,
        navigation: {
          nextEl: '#right-button',
          prevEl: '#left-button',
        },
      });
    }

    if (!swiper2) {
      swiper2 = new Swiper('#basic-swiper-second', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        a11y: false,
        spaceBetween: 10,
        allowTouchMove: false,
        centeredSlides: true,
        centeredSlidesBounds: true,
        loop: true,
        navigation: {
          nextEl: '#right-button-second',
          prevEl: '#left-button-second',
        },
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBasicSwipers);
  } else {
    initBasicSwipers();
  }

  window.addEventListener('resize', initBasicSwipers);
})();