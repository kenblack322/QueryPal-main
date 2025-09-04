'use strict';
gsap.registerPlugin(ScrollTrigger, SplitText);

export const globalElement = {
  bodyTag: document.querySelector('body'),
  pageWrapper: document.querySelector('.page-wrapper'),
  mainWrapper: document.querySelector('.main-wrapper'),
};

export const globalEasing = {
  EASE_EASE: 'power2.out',
  EASE_EXPO: 'expo.inOut',
  EASE_POWER: 'power2.out',
  EASE_NONE: 'none',
};

// IS MOBILE CONDITION
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// export const globalTextAnimations = {
//   textFX1: document.querySelectorAll('[split-text-effect="1"]'),
//   textFX2: document.querySelectorAll('[split-text-effect="2"]'),
// };

export const globalBlockAnimations = {
  blockFX1: document.querySelectorAll('[gsap-block-effect="1"]'),
  blockFX2: document.querySelectorAll('[gsap-block-effect="2"]'),
};

//
// GLOBAL FUNCTIONS
//

function blogCardsHover() {
  const cards = document.querySelectorAll(
    '.blog-card-main, .blog-static, .blog-big__component, .blog-card, .blog-card-template'
  );

  cards.forEach((card) => {
    const link = card.querySelector('.blog-card__link');
    const button = card.querySelector('.circle-pluse-43');
    const image = card.querySelector('.image');

    if (!link || !button || !image) return;

    link.addEventListener('mouseenter', () => {
      button.classList.add('is-hovered');
      gsap.to(image, {
        scale: 1.05,
      });
    });

    link.addEventListener('mouseleave', () => {
      button.classList.remove('is-hovered');
      gsap.to(image, {
        scale: 1,
      });
    });
  });
}

function headerBlurAnimation() {
  const headerBlur = document.querySelector('.header-blur');

  gsap.set(headerBlur, {
    height: '0%',
  });

  ScrollTrigger.create({
    trigger: '.main-wrapper',
    start: 'top top',
    end: '+=200',
    scrub: true,
    ease: 'power4.out',
    onUpdate: (self) => {
      const progress = self.progress;

      gsap.set(headerBlur, {
        height: `${progress * 100}%`,
      });
    },
  });
}

function pageWrapperOpenAnimation() {
  const pageWrapper = globalElement.pageWrapper;

  gsap.to(pageWrapper, {
    autoAlpha: 1,
    duration: 0.6,
    ease: 'power2.inOut',
    onComplete: () => {
      pageWrapper.classList.remove('page-wrapper_close');
    },
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// ADAPTIVES /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

headerBlurAnimation();
pageWrapperOpenAnimation();

// ONLY DESKTOP FUNCTIONS
if (!isMobile() && window.innerWidth > 991) {
  blogCardsHover();

  // globalBlockAnimations.blockFX1.forEach((el) => {
  //   gsap.from(el, {
  //     y: 50,
  //     opacity: 0,
  //     duration: 0.8,
  //     ease: 'power2.out',
  //     scrollTrigger: {
  //       trigger: el,
  //       start: 'top 90%',
  //       toggleActions: 'play none none none',
  //     },
  //   });
  // });
}

// ONLY MOBILE FUNCTIONS
if (isMobile() && window.innerWidth < 479) {
}
