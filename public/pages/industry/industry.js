'use strict';

(function () {
  function initBasicSwipers() {
    if (typeof Swiper === 'undefined') return;

    if (window.innerWidth > 479) {
      console.log('Swiper initialization skipped because window width is greater than 479px.');
      return;
    }

    new Swiper('#basic-swiper', {
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

    new Swiper('#basic-swiper-second', {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBasicSwipers);
  } else {
    initBasicSwipers();
  }
})();