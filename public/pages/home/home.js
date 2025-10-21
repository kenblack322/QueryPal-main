'use strict';

import { globalElement, globalEasing, isMobile } from '/global/global.js';

//

const { bodyTag, pageWrapper, mainWrapper } = globalElement;
const { EASE_EASE, EASE_EXPO, EASE_POWER, EASE_NONE  } = globalEasing;

//

function swiperHomeNews() {
  const swiperNewsInit = new Swiper('#homeBlogSwiper', {
    spaceBetween: 16,
    slidesPerView: 2.5,
    slidesPerGroup: 1,

    observer: true,
    observeParents: true,

    grabCursor: true,
    a11y: false,
    allowTouchMove: true,

    loop: true,
    speed: 600,

    navigation: {
      nextEl: '[h-blog-button=next]',
      prevEl: '[h-blog-button=prev]',
    },

    breakpoints: {
      992: {
        spaceBetween: 16,
        slidesPerView: 2.5,
        slidesPerGroup: 1,
      },
      768: {
        spaceBetween: 16,
        slidesPerView: 2.5,
        slidesPerGroup: 1,
      },
      480: {
        spaceBetween: 16,
        slidesPerView: 2.5,
        slidesPerGroup: 1,
      },
      0: {
        spaceBetween: 16,
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
    },
  });
}

function featuresHoverOverElement() {
  const circle = document.querySelector('.features-cirle');
  const cursor = circle.querySelector('.features-cirle__cursor');

  const bounds = 400; // Максимальное отклонение в px

  // Быстрое обновление x/y с инерцией
  const quickX = gsap.quickTo(cursor, "x", { duration: 0.6, ease: "power3.out" });
  const quickY = gsap.quickTo(cursor, "y", { duration: 0.6, ease: "power3.out" });

  circle.addEventListener('mousemove', (e) => {
    const rect = circle.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;

    const normX = (relX / (rect.width / 2));
    const normY = (relY / (rect.height / 2));

    const x = normX * bounds;
    const y = normY * bounds;

    quickX(x);
    quickY(y);
  });

  circle.addEventListener('mouseleave', () => {
    quickX(0);
    quickY(0);
  });
}

function feedbackSlider() {
  const swiperMain = new Swiper('#feedbackMainSwiper', {
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
      el: '#feedbackPagination',
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

function homeHeaderScrollAnimation(marginInRem) {
  ScrollTrigger.create({
    trigger: '.page-wrapper',
    start: 'top top',
    end: '+=200',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const startInset = marginInRem;
      const endInset = 0;
      const currentInset = startInset - (startInset - endInset) * progress;

      gsap.set('.header-home', {
        top: `${currentInset}rem`,
      });
    },
  });
}



///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// ADAPTIVES /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

swiperHomeNews();
feedbackSlider();

// DESKTOP FUNCTIONS
if (!isMobile() && window.innerWidth > 992) {
  featuresHoverOverElement();
}
if (!isMobile() && window.innerWidth > 480) {
  homeHeaderScrollAnimation(2);
}

// MOBILE FUNCTIONS
if (isMobile() && window.innerWidth < 479) {
  homeHeaderScrollAnimation(0);
}
// GSAP statistics animation block
document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  const section  = document.querySelector('.stats_text-heading')?.closest('section') || document.body;
  const wrappers = gsap.utils.toArray('.stats_text-wrapper');
  const nums     = gsap.utils.toArray('.stats_text-heading .stat-num').slice(0, 3); // take first 3

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 80%', once: true }
  });

  // 1) Fade and slide down text blocks sequentially
  tl.from(wrappers, {
    y: -20, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.15
  });

  // 2) Count numbers from 0 to data-target (keep decimals if exist)
  const countTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  nums.forEach((el, i) => {
    const targetStr = (el.dataset.target || '0').trim().replace(/\s/g,'');
    const to = parseFloat(targetStr.replace(',', '.')) || 0;
    const decimals = (targetStr.split(/[.,]/)[1] || '').length;
    const proxy = { v: 0 };

    countTl.to(proxy, {
      v: to, duration: 1.2, onUpdate: () => {
        el.textContent = proxy.v.toFixed(decimals).replace('.', ',');
      }
    }, i * 0.2); // small delay between numbers
  });

  tl.add(countTl, '>-0.1'); // start counting after fade animation
});