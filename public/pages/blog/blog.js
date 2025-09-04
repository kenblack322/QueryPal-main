document.addEventListener('DOMContentLoaded', () => {
  const ctaItem = document.querySelector('.blog-card-main__cta-static')?.closest('.blog_item');

  function repositionCTA() {
    const visibleItems = [...document.querySelectorAll('.blog_item')].filter(
      (el) => !el.querySelector('.blog-card-main__cta-static') && el.offsetParent !== null
    );

    if (ctaItem && visibleItems.length >= 3) {
      visibleItems[2].after(ctaItem); // вставить после третьего
    }
  }

  repositionCTA();

  document.addEventListener('fs-cmsfilter:updated', () => {
    repositionCTA();
  });
});

function swiperBlogInit() {
  const swiperBlogElement = new Swiper('#swiperBlog', {
    spaceBetween: 32,
    slidesPerView: 1,
    slidesPerGroup: 1,

    observer: true,
    observeParents: true,

    grabCursor: true,
    a11y: false,
    allowTouchMove: true,

    loop: false,
    speed: 600,

    navigation: {
      nextEl: '[blogButton=next]',
      prevEl: '[blogButton=prev]',
    },
  });
}

// IS MOBILE CONDITION
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// MOBILE FUNCTIONS
if (isMobile() && window.innerWidth < 479) {
  swiperBlogInit();
}
