'use strict';

/* ===== No-clip footer toggle =====
   Reads flag from inline CMS script (window.NO_CLIP_FOOTER) */
function applyNoClipFooterFlag() {
  var flag = window.NO_CLIP_FOOTER;
  // Accepts true, "true", "1"
  if (flag === true || flag === 'true' || flag === '1') {
    document.documentElement.classList.add('no-clip-footer');
  }
}

/* ===== Swiper (your existing) ===== */
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
      0:   { spaceBetween: 16, slidesPerView: 1, slidesPerGroup: 1 },
      768: { spaceBetween: 16, slidesPerView: 1, slidesPerGroup: 1 },
      992: { spaceBetween: 32, slidesPerView: 1, slidesPerGroup: 1 },
    },
  });
}

/* ===== Init on DOM ready ===== */
document.addEventListener('DOMContentLoaded', () => {
  applyNoClipFooterFlag();
  swiperTestimonial();
});