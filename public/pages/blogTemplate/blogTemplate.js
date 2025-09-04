function swiperReadmoreInit() {
  const swiperReadmore = new Swiper('#swiperReadmore', {
    spaceBetween: 30,
    slidesPerView: 3,
    slidesPerGroup: 1,

    observer: true,
    observeParents: true,

    grabCursor: true,
    a11y: false,
    allowTouchMove: true,

    loop: false,
    speed: 600,

    navigation: {
      nextEl: '[readmoreButton=next]',
      prevEl: '[readmoreButton=prev]',
    },

    breakpoints: {
      992: {
        spaceBetween: 30,
        slidesPerView: 3,
        slidesPerGroup: 1,
      },
      768: {
        spaceBetween: 30,
        slidesPerView: 3,
        slidesPerGroup: 1,
      },
      480: {
        spaceBetween: 30,
        slidesPerView: 3,
        slidesPerGroup: 1,
      },
      0: {
        spaceBetween: 32,
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
    },
  });
}

swiperReadmoreInit();
