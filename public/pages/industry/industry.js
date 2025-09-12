'use strict';

(function () {
  function initBasicSwipers() {
    if (typeof Swiper === 'undefined') return;

    new Swiper('#basic-swiper', {
      slidesPerView: 1,
      slidesPerGroup: 1,
      grabCursor: true,
      a11y: false,
      allowTouchMove: true,
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
      grabCursor: true,
      a11y: false,
      spaceBetween: 10,
      allowTouchMove: true,
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