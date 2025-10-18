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
