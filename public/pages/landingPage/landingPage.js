'use strict';

function swiperTestimonial() {
  const swiperTestimonialInit = new Swiper('#testimonialSwiper', {
    spaceBetween: 32,
    slidesPerView: 1,
    slidesPerGroup: 1,

    observer: true,
    observeParents: true,

    grabCursor: true,
    a11y: false,
    allowTouchMove: true,

    loop: true,
	  speed: 600,

    navigation: {
      nextEl: '[testiButton=next]',
      prevEl: '[testiButton=prev]',
    },

    breakpoints: {
      0: {
        spaceBetween: 16,
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
      768: {
        spaceBetween: 16,
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
      992: {
        spaceBetween: 32,
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  swiperTestimonial();
});