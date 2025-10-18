function feedbackSlider() {
  // Ждем, пока DOM полностью загрузится
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', feedbackSlider);
    return;
  }
  
  const swiperElement = document.querySelector('.swiper');
  if (!swiperElement) {
    console.log('Swiper element not found, retrying...');
    setTimeout(feedbackSlider, 100);
    return;
  }
  
  // Проверяем, не инициализирован ли уже Swiper
  if (swiperElement.classList.contains('swiper-initialized')) {
    console.log('Swiper already initialized');
    return;
  }
  
  // Проверяем, что Swiper загружен
  if (typeof Swiper === 'undefined') {
    console.error('Swiper library not loaded');
    return;
  }

  try {
    console.log('Initializing Swiper...');
    console.log('Swiper element:', swiperElement);
    console.log('Swiper classes:', swiperElement.className);
    
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
    
    console.log('Swiper initialized successfully');
  } catch (error) {
    console.error('Swiper initialization failed:', error);
  }

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

// Инициализируем с задержкой для Webflow
setTimeout(feedbackSlider, 500);

// Также отслеживаем изменения DOM для Webflow компонентов
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      // Проверяем, появились ли новые элементы с классом .swiper
      const newSwipers = Array.from(mutation.addedNodes).filter(node => 
        node.nodeType === 1 && node.classList && node.classList.contains('swiper')
      );
      
      if (newSwipers.length > 0) {
        console.log('New swiper elements detected, reinitializing...');
        setTimeout(feedbackSlider, 100);
      }
    }
  });
});

// Начинаем наблюдение
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// DESKTOP FUNCTIONS
if (!isMobile() && window.innerWidth > 992) {
}

// MOBILE FUNCTIONS
if (isMobile() && window.innerWidth < 479) {
}
