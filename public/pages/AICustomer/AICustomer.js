
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
      console.warn('Unable to obtain a GSAP instance. Please verify that the library is loaded.');
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

  /* ------------------------------------------------------------------------
   * Donut charts calculator
   * --------------------------------------------------------------------- */
  (() => {
    const CENTER = 155;
    const RADIUS = 130;
    const SVG_NS = 'http://www.w3.org/2000/svg';

    const angleToPoint = (angle) => {
      const rad = (angle * Math.PI) / 180;
      return {
        x: CENTER + RADIUS * Math.cos(rad),
        y: CENTER + RADIUS * Math.sin(rad),
      };
    };

    const createArc = (percent) => {
      const clamped = Math.max(0, Math.min(100, percent));
      const startAngle = -90;
      const sweep = (clamped / 100) * 360;
      const endAngle = startAngle + sweep;
      const largeArcFlag = clamped > 50 ? 1 : 0;

      const start = angleToPoint(startAngle);
      const end = angleToPoint(endAngle);

      return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    };

    const donuts = {
      month1: {
        path: document.getElementById('calc-donut-month1-path'),
        value: document.getElementById('calc-donut-month1-value'),
        rest: document.getElementById('calc-donut-month1-rest'),
        gradientId: 'gradient-top-month1',
      },
      month3: {
        path: document.getElementById('calc-donut-month3-path'),
        value: document.getElementById('calc-donut-month3-value'),
        rest: document.getElementById('calc-donut-month3-rest'),
        gradientId: 'gradient-top-month3',
      },
      year1: {
        path: document.getElementById('calc-donut-year1-path'),
        value: document.getElementById('calc-donut-year1-value'),
        rest: document.getElementById('calc-donut-year1-rest'),
        gradientId: 'gradient-top-year1',
      },
    };

    const updateDonut = (key, percent) => {
      const donut = donuts[key];
      if (!donut || !donut.path) return;

      donut.path.setAttributeNS(null, 'd', createArc(percent));
      donut.path.setAttributeNS(null, 'stroke', `url(#${donut.gradientId})`);
      donut.path.setAttributeNS(null, 'stroke-width', '50');
      donut.path.setAttributeNS(null, 'fill', 'none');
      donut.path.setAttributeNS(null, 'stroke-linecap', 'round');
      donut.path.style.stroke = '';
      donut.path.style.fill = '';

      if (donut.value) donut.value.textContent = `${percent}%`;

      if (donut.rest) {
        const rest = Math.max(0, Math.min(100, 100 - percent));
        donut.rest.textContent = `${rest}%`;
      }
    };

    window.calcUpdateDonuts = (deflection) => {
      const d = Number(deflection) || 0;
      const month3 = Math.max(0, Math.min(100, Math.round(d)));
      const month1 = Math.max(0, Math.min(100, Math.round(d * 0.25)));
      const year1 = Math.min(Math.round(d * 2), 99);

      updateDonut('month3', month3);
      updateDonut('month1', month1);
      updateDonut('year1', year1);
    };

    window.calcUpdateDonuts(85);
  })();

  /* ------------------------------------------------------------------------
   * Deflection slider color change based on value proximity to 10 or 90
   * --------------------------------------------------------------------- */
  (() => {
    // Convert hex color to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    // Interpolate between two colors
    const interpolateColor = (color1, color2, factor) => {
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);

      if (!rgb1 || !rgb2) return color1;

      const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
      const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
      const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

      return `rgb(${r}, ${g}, ${b})`;
    };

    // Calculate proximity factor to 10 or 90
    const getProximityFactor = (value) => {
      const target1 = 10;
      const target2 = 90;
      const threshold = 40; // Distance at which color fully changes

      // Calculate distance to nearest target point
      const dist1 = Math.abs(value - target1);
      const dist2 = Math.abs(value - target2);
      const minDist = Math.min(dist1, dist2);

      // If value is far from 10 and 90, return 0 (base color)
      if (minDist >= threshold) return 0;

      // Smooth interpolation using ease-out function
      const normalized = 1 - minDist / threshold;
      return Math.pow(normalized, 1.5); // Adjust exponent for smoother/sharp transition
    };

    const updateSliderColor = () => {
      const sliderFill = document.querySelector('.fs_rangeslider-1_fill');
      if (!sliderFill) return;

      // Get value from calc-deflection-output
      const outputEl = document.getElementById('calc-deflection-output');
      if (!outputEl) return;

      const value = parseFloat(outputEl.textContent) || 0;
      const factor = getProximityFactor(value);

      const color1 = '#b35dff'; // Base purple color
      const color2 = '#DF7D94'; // Pink color when close to 10/90

      const newColor = interpolateColor(color1, color2, factor);
      sliderFill.style.backgroundColor = newColor;
    };

    // Track deflection value changes
    const initDeflectionColorChange = () => {
      const outputEl = document.getElementById('calc-deflection-output');
      if (!outputEl) return;

      // Use MutationObserver to track text changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            updateSliderColor();
          }
        });
      });

      observer.observe(outputEl, {
        childList: true,
        characterData: true,
        subtree: true,
      });

      // Update color on load
      updateSliderColor();
    };

    // Initialize
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDeflectionColorChange);
    } else {
      initDeflectionColorChange();
    }
  })();
})();

