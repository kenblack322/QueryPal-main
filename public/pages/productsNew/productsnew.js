function initMobileSwiper() {
  // Ищем все элементы с классом swiper
  const swiperElements = document.querySelectorAll('.swiper');
  
  swiperElements.forEach(element => {
    new Swiper(element, {
      // Основные настройки для мобильного
      spaceBetween: 10,
      slidesPerView: 1,
      centeredSlides: true,
      
      // Мобильные настройки
      touchRatio: 1,
      touchAngle: 45,
      grabCursor: true,
      allowTouchMove: true,
      
      // Автоплей
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      
      // Скорость анимации
      speed: 300,
      
      // Цикличность
      loop: true,
    });
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// MOBILE SWIPER /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// Инициализация свайпера при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initMobileSwiper();
});

// Переинициализация при изменении размера окна
window.addEventListener('resize', function() {
  initMobileSwiper();
});
