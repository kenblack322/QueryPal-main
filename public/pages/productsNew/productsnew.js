function feedbackSlider() {
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
        el: '.swiper-pagination',
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

feedbackSlider();
