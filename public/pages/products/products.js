function feedbackSlider() {
  const swiperMain = new Swiper('.swiper', {
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
      bulletClass: 'feedback-bullet', // Убери точку
      bulletActiveClass: 'feedback-bullet-active', // Убери точку
    },
  });

  // const swiperSecond = new Swiper('#feedbackSecondSwiper', {
  //   spaceBetween: 0,
  //   slidesPerView: 1,
  //   slidesPerGroup: 1,
  //   observer: true,
  //   observeParents: true,
  //   allowTouchMove: false,
  //   loop: true,
  //   speed: 600,
  //   effect: 'fade',
  //   fadeEffect: {
  //     crossFade: true,
  //   },
  // });

  // // Синхронизация
  // swiperMain.controller.control = swiperSecond;
  // swiperSecond.controller.control = swiperMain;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// ADAPTIVES /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// IS MOBILE CONDITION
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

feedbackSlider();

// DESKTOP FUNCTIONS
if (!isMobile() && window.innerWidth > 992) {
}

// MOBILE FUNCTIONS
if (isMobile() && window.innerWidth < 479) {
}
