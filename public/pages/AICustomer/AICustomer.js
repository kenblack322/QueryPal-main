
(() => {
  if (typeof window === 'undefined') return;

  /* ------------------------------------------------------------------------
   * Swiper (initialized only on <= 479px)
   * --------------------------------------------------------------------- */
  let basicSwiper = null;

  const initSwiper = () => {
    if (!window.Swiper) {
      console.warn('Swiper is not available on window. Ensure the CDN script loads before this module.');
      return;
    }

    if (window.innerWidth <= 479) {
      if (!basicSwiper) {
        basicSwiper = new window.Swiper('#basic-swiper', {
          slidesPerView: 'auto',
          grabCursor: true,
          loop: true,
          a11y: false,
          allowTouchMove: true,
          navigation: {
            nextEl: '#right-button',
            prevEl: '#left-button',
          },
        });
        window.basicSwiper = basicSwiper;
      }
    } else if (basicSwiper) {
      basicSwiper.destroy(true, true);
      basicSwiper = null;
      window.basicSwiper = null;
    }
  };

  if (document.readyState === 'complete') {
    initSwiper();
  } else {
    window.addEventListener('load', initSwiper, { once: true });
  }

  window.addEventListener('resize', initSwiper);

  /* ------------------------------------------------------------------------
   * Accordion interactions (requires Webflow IX2 + GSAP)
   * --------------------------------------------------------------------- */
  window.Webflow ||= [];
  window.Webflow.push(() => {
    const ix2 = typeof Webflow.require === 'function' ? Webflow.require('ix2') : null;

    const gsapCandidates = [
      ix2?.gsap?.gsap,
      ix2?.gsap?.default,
      ix2?.gsap,
      window.gsap,
      window.TweenLite && {
        set: window.TweenLite.set.bind(window.TweenLite),
        to: (target, vars) =>
          window.TweenLite.to(
            target,
            vars?.duration ?? vars?.time ?? 0.3,
            { ...vars, duration: undefined, time: undefined },
          ),
        timeline: (config = {}) => new window.TimelineLite(config),
      },
    ];

    const gsap = gsapCandidates.find(
      (candidate) =>
        candidate &&
        typeof candidate.set === 'function' &&
        typeof candidate.to === 'function' &&
        typeof candidate.timeline === 'function',
    );

    if (!gsap) {
      console.warn('Не удалось получить объект GSAP. Проверьте подключение.');
      return;
    }

    const R = '1.5rem';
    const OPEN_BORDER = '#D6D6D6';
    const ICON_OPEN = '#B35DFF';
    const ICON_CLOSED = 'rgba(39,22,43,0.1)';

    const items = document.querySelectorAll('.accordion-wrapper');
    if (!items.length) return;

    items.forEach((wrap) => {
      const head = wrap.querySelector('.accordion-heading_wrapper');
      const iconWrap = wrap.querySelector('.accordion-icon-wrapper');
      const panel =
        wrap.querySelector('.accordion-content') ||
        wrap.querySelector('.accordion-text_wrapper');

      if (!head || !iconWrap || !panel) return;

      const panelStyles = getComputedStyle(panel);
      const padTop = parseFloat(panelStyles.paddingTop) || 0;
      const padBottom = parseFloat(panelStyles.paddingBottom) || 0;
      const marginTop = parseFloat(panelStyles.marginTop) || 0;
      const marginBottom = parseFloat(panelStyles.marginBottom) || 0;
      const marginLeft = parseFloat(panelStyles.marginLeft) || 0;
      const marginRight = parseFloat(panelStyles.marginRight) || 0;

      const svg = iconWrap.querySelector('svg');
      const paths = svg ? svg.querySelectorAll('path') : [];
      const hLine = paths[0] || null;
      const vLine =
        svg?.querySelector('[data-plus-vertical]') ||
        (paths.length > 1 ? paths[1] : null);

      const contentEls =
        panel.querySelectorAll('.accordion-text_inner').length
          ? Array.from(panel.querySelectorAll('.accordion-text_inner'))
          : Array.from(panel.children);

      panel.style.transition = 'none';
      panel.style.overflow = 'hidden';

      const openInit = wrap.classList.contains('is-open');
      if (!openInit) wrap.classList.remove('is-open');

      gsap.set(panel, {
        display: openInit ? 'block' : 'none',
        maxHeight: openInit ? panel.scrollHeight : 0,
        opacity: openInit ? 1 : 0,
        paddingTop: openInit ? padTop : 0,
        paddingBottom: openInit ? padBottom : 0,
        marginTop: openInit ? marginTop : 0,
        marginBottom: openInit ? marginBottom : 0,
        marginLeft: openInit ? marginLeft : 0,
        marginRight: openInit ? marginRight : 0,
      });

      gsap.set(contentEls, { opacity: openInit ? 1 : 0, y: openInit ? 0 : -6 });

      gsap.set(wrap, {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: openInit ? OPEN_BORDER : 'transparent',
        borderRadius: R,
      });

      gsap.set(head, {
        borderBottomLeftRadius: openInit ? '0rem' : R,
        borderBottomRightRadius: openInit ? '0rem' : R,
      });

      gsap.set(iconWrap, {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: openInit ? ICON_OPEN : ICON_CLOSED,
      });

      if (svg) {
        gsap.set(svg, { rotation: openInit ? 180 : 0, transformOrigin: '50% 50%' });
      }

      if (hLine) {
        gsap.set(hLine, { transformBox: 'fill-box', transformOrigin: '50% 50%', scaleX: 1 });
      }

      if (vLine) {
        gsap.set(vLine, {
          transformBox: 'fill-box',
          transformOrigin: '50% 50%',
          scaleY: openInit ? 0 : 1,
          opacity: openInit ? 0 : 1,
        });
      }

      const open = () => {
        gsap.set(panel, { display: 'block' });
        const targetHeight = panel.scrollHeight;
        const tl = gsap.timeline({
          onComplete() {
            gsap.set(panel, { maxHeight: 'none' });
          },
        });

        tl.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0);

        tl.fromTo(
          panel,
          {
            maxHeight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
          },
          {
            maxHeight: targetHeight,
            paddingTop: padTop,
            paddingBottom: padBottom,
            marginTop,
            marginBottom,
            marginLeft,
            marginRight,
            duration: 0.45,
            ease: 'power2.out',
          },
          0,
        );

        tl.to(
          contentEls,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            stagger: 0.04,
          },
          0.12,
        );

        gsap.to(wrap, {
          borderColor: OPEN_BORDER,
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(head, {
          borderBottomLeftRadius: '0rem',
          borderBottomRightRadius: '0rem',
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(iconWrap, {
          borderColor: ICON_OPEN,
          duration: 0.3,
          ease: 'power2.out',
        });

        if (svg) {
          gsap.to(svg, {
            rotation: 180,
            duration: 0.45,
            ease: 'power3.out',
          });
        }

        if (hLine) {
          gsap.fromTo(
            hLine,
            { scaleX: 0.9 },
            { scaleX: 1, duration: 0.35, ease: 'power3.out' },
          );
        }

        if (vLine) {
          gsap.to(vLine, {
            scaleY: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'back.in(1.4)',
          });
        }

        wrap.classList.add('is-open');
        head.setAttribute('aria-expanded', 'true');
      };

      const close = () => {
        const currentHeight = panel.scrollHeight || 0;
        gsap.set(panel, { maxHeight: currentHeight, opacity: 1 });
        gsap.set(contentEls, { opacity: 1, y: 0 });

        const tl = gsap.timeline({
          onComplete() {
            gsap.set(panel, {
              display: 'none',
              maxHeight: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              marginBottom: 0,
              marginLeft: 0,
              marginRight: 0,
            });

            gsap.set(contentEls, { opacity: 0, y: -6 });
            wrap.classList.remove('is-open');
          },
        });

        tl.to(
          contentEls,
          {
            opacity: 0,
            y: -6,
            duration: 0.35,
            ease: 'power2.in',
            stagger: 0.04,
          },
          0,
        );

        const textAnimDuration = 0.35 + contentEls.length * 0.04;

        tl.to(
          panel,
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
          },
          textAnimDuration - 0.12,
        );

        tl.to(
          panel,
          {
            maxHeight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            duration: 0.45,
            ease: 'power2.in',
          },
          textAnimDuration - 0.12,
        );

        gsap.to(wrap, {
          borderColor: 'transparent',
          duration: 0.3,
          ease: 'power2.in',
        });

        gsap.to(head, {
          borderBottomLeftRadius: R,
          borderBottomRightRadius: R,
          duration: 0.3,
          ease: 'power2.in',
        });

        gsap.to(iconWrap, {
          borderColor: ICON_CLOSED,
          duration: 0.3,
          ease: 'power2.in',
        });

        if (svg) {
          gsap.to(svg, {
            rotation: 0,
            duration: 0.4,
            ease: 'power3.in',
          });
        }

        if (hLine) {
          gsap.to(hLine, {
            scaleX: 1,
            duration: 0.3,
            ease: 'power3.inOut',
          });
        }

        if (vLine) {
          gsap.to(vLine, {
            scaleY: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.4)',
          });
        }

        head.setAttribute('aria-expanded', 'false');
      };

      const toggle = (event) => {
        if (event) event.preventDefault();
        wrap.classList.contains('is-open') ? close() : open();
      };

      const handleHoverIn = () => {
        if (wrap.classList.contains('is-open')) return;
        gsap.to(iconWrap, { borderColor: ICON_OPEN, duration: 0.25, ease: 'power2.out' });
      };

      const handleHoverOut = () => {
        if (wrap.classList.contains('is-open')) return;
        gsap.to(iconWrap, { borderColor: ICON_CLOSED, duration: 0.25, ease: 'power2.out' });
      };

      head.setAttribute('role', 'button');
      head.setAttribute('tabindex', '0');
      head.setAttribute('aria-expanded', openInit ? 'true' : 'false');

      head.addEventListener('click', toggle);
      head.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') toggle(event);
      });

      iconWrap.addEventListener('mouseenter', handleHoverIn);
      iconWrap.addEventListener('mouseleave', handleHoverOut);
    });
  });
})();

