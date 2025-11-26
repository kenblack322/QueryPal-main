
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
    const QUERYPAL_PRICE_PER_TICKET = 1.0;
    const MONTHS_PER_YEAR = 12;

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

    const updateDonut = (key, costWithPercent, costWithoutPercent) => {
      const donut = donuts[key];
      if (!donut || !donut.path) return;

      // Ensure costWithoutPercent is valid (use provided value or calculate from costWithPercent)
      const costWithout = costWithoutPercent !== undefined 
        ? Math.max(0, Math.min(100, costWithoutPercent))
        : Math.max(0, Math.min(100, 100 - costWithPercent));
      
      // The filled segment (brown donut) shows "Cost with QueryPal" percentage (left value)
      // This should be a small segment (e.g., 3% for Year 1)
      donut.path.setAttributeNS(null, 'd', createArc(costWithPercent));
      donut.path.setAttributeNS(null, 'stroke', `url(#${donut.gradientId})`);
      donut.path.setAttributeNS(null, 'stroke-width', '50');
      donut.path.setAttributeNS(null, 'fill', 'none');
      donut.path.setAttributeNS(null, 'stroke-linecap', 'round');
      donut.path.style.stroke = '';
      donut.path.style.fill = '';

      // Left value shows "Cost with QueryPal"
      if (donut.value) donut.value.textContent = `${Math.round(costWithPercent)}%`;

      // Right value shows "Cost without QueryPal" (this is what fills the brown segment)
      if (donut.rest) {
        donut.rest.textContent = `${Math.round(costWithout)}%`;
      }
    };

    // Calculate "Cost with QueryPal" as percentage of total cost
    const calculateCostWithPercentage = (deflectionValue, baseAgents, baseTicketsPerMonth, salary) => {
      // Apply deflection to calculate costs
      const totalYearlyTickets = baseTicketsPerMonth * MONTHS_PER_YEAR;
      const totalAgentSalaries = baseAgents * salary;
      const currentCostPerTicket = totalYearlyTickets > 0 ? totalAgentSalaries / totalYearlyTickets : 0;
      
      const deflectionDecimal = Math.max(0, Math.min(100, deflectionValue)) / 100;
      const remainingDecimal = 1 - deflectionDecimal;
      
      // Cost With QueryPal
      const queryPalCost = totalYearlyTickets * deflectionDecimal * QUERYPAL_PRICE_PER_TICKET;
      const humanCost = totalYearlyTickets * remainingDecimal * currentCostPerTicket;
      const costWithQueryPal = queryPalCost + humanCost;
      
      // Cost Without QueryPal
      const costWithoutQueryPal = totalAgentSalaries;
      
      // Total cost (for reference, but we use Cost Without + Cost With for percentage)
      const totalCost = costWithoutQueryPal + costWithQueryPal;
      
      // Calculate "Cost with QueryPal" as percentage of total cost
      if (totalCost === 0) return 0;
      return (costWithQueryPal / totalCost) * 100;
    };

    window.calcUpdateDonuts = (deflection, inputs = null) => {
      const d = Number(deflection) || 0;
      
      // Get inputs - either passed as parameter or read from DOM
      let agents = 0;
      let salary = 0;
      let ticketsPerMonth = 0;
      
      if (inputs && inputs.agents && inputs.salary && inputs.ticketsPerMonth) {
        agents = inputs.agents;
        salary = inputs.salary;
        ticketsPerMonth = inputs.ticketsPerMonth;
      } else {
        // Fallback: read from DOM
        const agentsEl = document.getElementById('calc-agents-input');
        const salaryEl = document.getElementById('calc-salary-input');
        const ticketsEl = document.getElementById('calc-tickets-input');
        
        if (agentsEl) {
          const text = agentsEl.value || agentsEl.textContent || agentsEl.innerText || '0';
          agents = parseFloat(text.toString().replace(/[^0-9.-]/g, '')) || 0;
        }
        if (salaryEl) {
          const text = salaryEl.value || salaryEl.textContent || salaryEl.innerText || '0';
          salary = parseFloat(text.toString().replace(/[^0-9.-]/g, '')) || 0;
        }
        if (ticketsEl) {
          const text = ticketsEl.value || ticketsEl.textContent || ticketsEl.innerText || '0';
          ticketsPerMonth = parseFloat(text.toString().replace(/[^0-9.-]/g, '')) || 0;
        }
      }
      
      // Follow client's formula for deflection values:
      // Month 3 = deflection rate (e.g., 70%)
      // Month 1 = 25% of Month 3 (e.g., 70 * 0.25 = 17.5%)
      // Year 1 = 2x of Month 3, but never over 99% (e.g., 70 * 2 = 140, but capped at 99%)
      const month3Deflection = Math.max(0, Math.min(100, Math.round(d)));
      const month1Deflection = Math.max(0, Math.min(100, Math.round(d * 0.25)));
      const year1Deflection = Math.min(Math.round(d * 2), 99);

      // Calculate percentages for each period
      let month1CostWith, month3CostWith, year1CostWith;
      let month1CostWithout, month3CostWithout, year1CostWithout;
      
      if (agents && salary && ticketsPerMonth) {
        // Calculate "Cost with QueryPal" as percentage of total cost
        month3CostWith = calculateCostWithPercentage(month3Deflection, agents, ticketsPerMonth, salary);
        month1CostWith = calculateCostWithPercentage(month1Deflection, agents, ticketsPerMonth, salary);
        year1CostWith = calculateCostWithPercentage(year1Deflection, agents, ticketsPerMonth, salary);
        
        // Ensure percentages are between 0 and 100
        month1CostWith = Math.max(0, Math.min(100, month1CostWith));
        month3CostWith = Math.max(0, Math.min(100, month3CostWith));
        year1CostWith = Math.max(0, Math.min(100, year1CostWith));
        
        // Calculate "Cost without QueryPal" percentage (what fills the donut segment)
        month1CostWithout = 100 - month1CostWith;
        month3CostWithout = 100 - month3CostWith;
        year1CostWithout = 100 - year1CostWith;
      } else {
        // Fallback: use deflection as approximation
        month3CostWith = Math.max(0, Math.min(100, month3Deflection));
        month1CostWith = Math.max(0, Math.min(100, month1Deflection));
        year1CostWith = Math.max(0, Math.min(100, year1Deflection));
        
        month1CostWithout = 100 - month1CostWith;
        month3CostWithout = 100 - month3CostWith;
        year1CostWithout = 100 - year1CostWith;
      }

      // Update donuts: segment is drawn using costWithoutPercent (right value, e.g., 3% for Year 1)
      // Left value shows costWithPercent, right value shows costWithoutPercent
      updateDonut('month1', Math.round(month1CostWith), Math.round(month1CostWithout));
      updateDonut('month3', Math.round(month3CostWith), Math.round(month3CostWithout));
      updateDonut('year1', Math.round(year1CostWith), Math.round(year1CostWithout));
    };
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

  /* ------------------------------------------------------------------------
   * ROI Calculator
   * --------------------------------------------------------------------- */
  (() => {
    // Constants
    const QUERYPAL_PRICE_PER_TICKET = 1.0;
    const MONTHS_PER_YEAR = 12;

    // Format currency
    const formatCurrency = (value) => {
      return '$' + Math.round(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
    };

    // Format number
    const formatNumber = (value) => {
      return Math.round(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
    };

    // Format percentage
    const formatPercent = (value) => {
      return value.toFixed(1) + '%';
    };

    // Helper to extract number from element (handles value, textContent, innerText)
    const extractNumber = (element) => {
      if (!element) return 0;
      const text = element.value || element.textContent || element.innerText || '0';
      // Remove currency symbols, commas, and other non-numeric characters except decimal point
      const cleaned = text.toString().replace(/[^0-9.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Get input values
    const getInputs = () => {
      const agentsEl = document.getElementById('calc-agents-input');
      const salaryEl = document.getElementById('calc-salary-input');
      const ticketsEl = document.getElementById('calc-tickets-input');
      const deflectionEl = document.getElementById('calc-deflection-output');

      const agents = extractNumber(agentsEl);
      const salary = extractNumber(salaryEl);
      const ticketsPerMonth = extractNumber(ticketsEl);
      const deflection = extractNumber(deflectionEl);
      
      // Get growth rate from checked radio button by ID
      // IDs are: calc-growth-0, calc-growth-25, calc-growth-50, calc-growth-75, calc-growth-100
      let growth = 0;
      const growthRadioIds = ['calc-growth-0', 'calc-growth-25', 'calc-growth-50', 'calc-growth-75', 'calc-growth-100'];
      
      for (const radioId of growthRadioIds) {
        const radio = document.getElementById(radioId);
        if (radio && radio.checked) {
          // Extract number from ID (e.g., "calc-growth-25" -> 25)
          const idMatch = radioId.match(/calc-growth-(\d+)/);
          if (idMatch) {
            growth = parseFloat(idMatch[1]) || 0;
            break;
          }
        }
      }
      
      // If no radio is checked, try to find default (calc-growth-25)
      if (growth === 0) {
        const defaultRadio = document.getElementById('calc-growth-25');
        if (defaultRadio) {
          // Set it as checked if none are checked
          if (!document.querySelector('input[id^="calc-growth-"]:checked')) {
            defaultRadio.checked = true;
            growth = 25;
          }
        }
      }

      return { agents, salary, ticketsPerMonth, deflection, growth };
    };

    // Calculate for a specific year with growth applied
    const calculateYear = (year, baseAgents, baseTicketsPerMonth, salary, deflection, growthRate) => {
      // Apply growth rate: Year 1 = base, Year 2 = base * (1 + growth), Year 3 = base * (1 + growth)^2
      const growthMultiplier = Math.pow(1 + growthRate / 100, year - 1);
      const agents = baseAgents * growthMultiplier;
      const ticketsPerMonth = baseTicketsPerMonth * growthMultiplier;
      const totalYearlyTickets = ticketsPerMonth * MONTHS_PER_YEAR;

      // Step 1: Total Yearly Tickets (already calculated above)
      // Step 2: Current Cost Per Ticket
      const totalAgentSalaries = agents * salary;
      const currentCostPerTicket = totalYearlyTickets > 0 ? totalAgentSalaries / totalYearlyTickets : 0;

      // Step 3: Cost With QueryPal
      const deflectionDecimal = Math.max(0, Math.min(100, deflection)) / 100; // Clamp between 0-100
      const remainingDecimal = 1 - deflectionDecimal;

      // Part 1: QueryPal Cost (tickets handled by QueryPal at $1 per ticket)
      const queryPalCost = totalYearlyTickets * deflectionDecimal * QUERYPAL_PRICE_PER_TICKET;

      // Part 2: Human Cost (remaining tickets handled by agents)
      const humanCost = totalYearlyTickets * remainingDecimal * currentCostPerTicket;

      // Total Cost With QueryPal
      const costWithQueryPal = queryPalCost + humanCost;

      // Step 4: Cost Without QueryPal (all tickets handled by agents)
      // According to client: "This number should be exactly the same as the Total Agent Salaries"
      // Formula: Total Yearly Tickets × Current Cost Per Ticket = Total Agent Salaries
      // So we can use totalAgentSalaries directly to avoid rounding errors
      const costWithoutQueryPal = totalAgentSalaries;

      // Step 5: ROI (Savings)
      // Cost Without should ALWAYS be greater than Cost With (because QueryPal is cheaper per ticket)
      const savings = costWithoutQueryPal - costWithQueryPal;

      // Tickets solved by AI
      const ticketsSolvedByAI = totalYearlyTickets * deflectionDecimal;

      return {
        agents,
        ticketsPerMonth,
        totalYearlyTickets,
        totalAgentSalaries,
        currentCostPerTicket,
        costWithQueryPal,
        costWithoutQueryPal,
        savings,
        ticketsSolvedByAI,
      };
    };

    // Calculate all years
    const calculateAll = () => {
      const inputs = getInputs();
      const { agents, salary, ticketsPerMonth, deflection, growth } = inputs;

      if (!agents || !salary || !ticketsPerMonth) {
        return null;
      }

      const year1 = calculateYear(1, agents, ticketsPerMonth, salary, deflection, growth);
      const year2 = calculateYear(2, agents, ticketsPerMonth, salary, deflection, growth);
      const year3 = calculateYear(3, agents, ticketsPerMonth, salary, deflection, growth);

      // Total savings over 3 years
      const totalSavings3Years = year1.savings + year2.savings + year3.savings;

      return {
        year1,
        year2,
        year3,
        totalSavings3Years,
        inputs,
      };
    };

    // Update UI elements
    const updateUI = (results) => {
      if (!results) return;

      const { year1, year2, year3, totalSavings3Years } = results;

      // Update headline savings
      const savingsYearEl = document.getElementById('calc-savings-year');
      const savings3YearEl = document.getElementById('calc-savings-3year');
      const roiEl = document.getElementById('calc-roi');
      const ticketsAIEl = document.getElementById('calc-tickets-ai');

      if (savingsYearEl) savingsYearEl.textContent = formatCurrency(year1.savings);
      if (savings3YearEl) savings3YearEl.textContent = formatCurrency(totalSavings3Years);
      if (roiEl) roiEl.textContent = formatCurrency(year1.savings); // ROI is always dollar amount
      if (ticketsAIEl) ticketsAIEl.textContent = formatNumber(year1.ticketsSolvedByAI);

      // Update popup savings preview (if popup exists)
      // Show total savings over 3 years as it's more impressive
      const popupSavingsEl = document.getElementById('calc-popup-savings-preview');
      if (popupSavingsEl) {
        popupSavingsEl.textContent = formatCurrency(totalSavings3Years);
      }

      // Update cost comparison for each year
      const updateCostElement = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = formatCurrency(value);
      };

      // Year 1
      updateCostElement('calc-cost-without-year1', year1.costWithoutQueryPal);
      updateCostElement('calc-cost-with-year1', year1.costWithQueryPal);

      // Year 2
      updateCostElement('calc-cost-without-year2', year2.costWithoutQueryPal);
      updateCostElement('calc-cost-with-year2', year2.costWithQueryPal);

      // Year 3
      updateCostElement('calc-cost-without-year3', year3.costWithoutQueryPal);
      updateCostElement('calc-cost-with-year3', year3.costWithQueryPal);

      // Update bar chart heights (if bars exist)
      const updateBarHeight = (id, value, maxValue) => {
        const bar = document.getElementById(id);
        if (bar && maxValue > 0) {
          const percentage = (value / maxValue) * 100;
          bar.style.height = `${Math.min(100, percentage)}%`;
        }
      };

      // Find max cost for scaling
      const actualMaxCost = Math.max(
        year1.costWithoutQueryPal,
        year2.costWithoutQueryPal,
        year3.costWithoutQueryPal,
        year1.costWithQueryPal,
        year2.costWithQueryPal,
        year3.costWithQueryPal,
      );

      // Round DOWN to a "nice" number that is LESS than the maximum
      // This ensures the top label is below the maximum value
      // Examples: 2,053,125 -> 2,000,000; 1,314,000 -> 1,200,000; 500,000 -> 500,000
      const calculateRoundedMax = (maxValue) => {
        if (maxValue <= 0) return 100000; // Default fallback
        
        const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
        const normalized = maxValue / magnitude;
        let roundedNormalized;
        
        // Round DOWN to nearest "nice" number
        if (normalized <= 1) roundedNormalized = 1;
        else if (normalized <= 1.5) roundedNormalized = 1;
        else if (normalized <= 2) roundedNormalized = 1.5;
        else if (normalized <= 2.5) roundedNormalized = 2;
        else if (normalized <= 5) roundedNormalized = 2.5;
        else if (normalized <= 10) roundedNormalized = 5;
        else roundedNormalized = 10;
        
        let roundedMax = roundedNormalized * magnitude;
        
        // Ensure roundedMax is LESS than maxValue (if not, go one step down)
        if (roundedMax >= maxValue) {
          // Find the next lower "nice" number
          if (roundedNormalized === 1) roundedNormalized = 0.5;
          else if (roundedNormalized === 1.5) roundedNormalized = 1;
          else if (roundedNormalized === 2) roundedNormalized = 1.5;
          else if (roundedNormalized === 2.5) roundedNormalized = 2;
          else if (roundedNormalized === 5) roundedNormalized = 2.5;
          else if (roundedNormalized === 10) roundedNormalized = 5;
          roundedMax = roundedNormalized * magnitude;
        }
        
        return roundedMax;
      };

      const roundedMaxCost = calculateRoundedMax(actualMaxCost);

      // Update Y-axis labels dynamically based on rounded max value
      // Supports labels on both left and right sides
      const updateYAxisLabels = (roundedMax) => {
        // Format label value
        const formatLabel = (value) => {
          if (value === 0) {
            return '$0K';
          } else {
            // Always format in thousands (K)
            const valueInK = Math.round(value / 1000);
            return `$${valueInK.toLocaleString('en-US')}K`;
          }
        };

        // Update a single label element (works for both left and right)
        const updateLabel = (id, value) => {
          const el = document.getElementById(id);
          if (el) el.textContent = formatLabel(value);
        };

        if (roundedMax <= 0) {
          // Default labels if no data
          for (let i = 0; i <= 6; i++) {
            const defaultValue = i * 50 * 1000; // $0K, $50K, $100K, etc.
            updateLabel(`calc-y-axis-left-${i}`, defaultValue);
            updateLabel(`calc-y-axis-right-${i}`, defaultValue);
          }
          return;
        }

        // Calculate step (divide into 6 equal intervals for 7 labels)
        const step = roundedMax / 6;

        // Generate labels (7 labels: 0 to 6) for both left and right sides
        for (let i = 0; i <= 6; i++) {
          const value = i * step;
          updateLabel(`calc-y-axis-left-${i}`, value);
          updateLabel(`calc-y-axis-right-${i}`, value);
        }
      };

      // Update Y-axis labels using rounded max (which is LESS than actual max)
      updateYAxisLabels(roundedMaxCost);

      // Update bar heights using the SAME rounded max value for consistency
      // This ensures bars align correctly with Y-axis labels
      updateBarHeight('calc-bar-without-year1', year1.costWithoutQueryPal, roundedMaxCost);
      updateBarHeight('calc-bar-with-year1', year1.costWithQueryPal, roundedMaxCost);
      updateBarHeight('calc-bar-without-year2', year2.costWithoutQueryPal, roundedMaxCost);
      updateBarHeight('calc-bar-with-year2', year2.costWithQueryPal, roundedMaxCost);
      updateBarHeight('calc-bar-without-year3', year3.costWithoutQueryPal, roundedMaxCost);
      updateBarHeight('calc-bar-with-year3', year3.costWithQueryPal, roundedMaxCost);
    };

    // Recalculate and update
    const recalculate = () => {
      const inputs = getInputs();
      
      const results = calculateAll();
      if (!results) {
        return;
      }
      
      // Store results globally for PDF download access
      window.calcLastResults = results;
      
      updateUI(results);
      
      // Export recalculate function for PDF module
      window.calcRecalculate = recalculate;

      // Update donut charts with deflection rate (following client's exact formula)
      if (window.calcUpdateDonuts && inputs.deflection !== undefined) {
        // Pass inputs so donuts can calculate percentages based on real data
        window.calcUpdateDonuts(inputs.deflection, inputs);
      }
    };

    // Initialize event listeners
    const initCalculator = () => {
      // Get all input elements
      const agentsEl = document.getElementById('calc-agents-input');
      const salaryEl = document.getElementById('calc-salary-input');
      const ticketsEl = document.getElementById('calc-tickets-input');
      const deflectionEl = document.getElementById('calc-deflection-output');

      // Add event listeners
      if (agentsEl) {
        agentsEl.addEventListener('input', recalculate);
        agentsEl.addEventListener('change', recalculate);
      }

      if (salaryEl) {
        salaryEl.addEventListener('input', recalculate);
        salaryEl.addEventListener('change', recalculate);
      }

      if (ticketsEl) {
        ticketsEl.addEventListener('input', recalculate);
        ticketsEl.addEventListener('change', recalculate);
      }

      // Watch for deflection changes using MutationObserver
      if (deflectionEl) {
        const observer = new MutationObserver(() => {
          recalculate();
        });
        observer.observe(deflectionEl, {
          childList: true,
          characterData: true,
          subtree: true,
        });
      }

      // Watch for growth rate changes by ID
      const growthRadioIds = ['calc-growth-0', 'calc-growth-25', 'calc-growth-50', 'calc-growth-75', 'calc-growth-100'];
      
      growthRadioIds.forEach((radioId) => {
        const radio = document.getElementById(radioId);
        if (radio) {
          radio.addEventListener('change', () => {
            recalculate();
          });
          radio.addEventListener('click', () => {
            // Small delay to ensure radio is checked
            setTimeout(recalculate, 10);
          });
        }
      });

      // Also use event delegation on document level as fallback
      document.addEventListener('change', (e) => {
        if (e.target && e.target.id && e.target.id.startsWith('calc-growth-')) {
          recalculate();
        }
      });
      
      document.addEventListener('click', (e) => {
        if (e.target && e.target.id && e.target.id.startsWith('calc-growth-')) {
          setTimeout(recalculate, 10);
        }
      });

      // Initial calculation
      recalculate();
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCalculator);
    } else {
      initCalculator();
    }
  })();

  /* ------------------------------------------------------------------------
   * reCAPTCHA v3 Integration
   * --------------------------------------------------------------------- */
  (() => {
    const RECAPTCHA_SITE_KEY = '6LdrqxgsAAAAAEYxrt5B3l5EWhf713nBn3jFCMby';
    
    // Load reCAPTCHA v3 script
    const loadRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        return Promise.resolve();
      }
      
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (document.querySelector('script[src*="recaptcha"]')) {
          // Script exists, wait for it to load
          const checkReady = setInterval(() => {
            if (window.grecaptcha && window.grecaptcha.ready) {
              clearInterval(checkReady);
              resolve();
            }
          }, 100);
          setTimeout(() => {
            clearInterval(checkReady);
            if (!window.grecaptcha) reject(new Error('reCAPTCHA failed to load'));
          }, 5000);
          return;
        }
        
        // Create and load script
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          window.grecaptcha.ready(() => {
            resolve();
          });
        };
        script.onerror = () => {
          reject(new Error('Failed to load reCAPTCHA script'));
        };
        document.head.appendChild(script);
      });
    };
    
    // Get reCAPTCHA token
    const getRecaptchaToken = async (action = 'submit') => {
      try {
        await loadRecaptcha();
        const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
        return token;
      } catch (error) {
        return null;
      }
    };
    
    // Expose function globally
    window.getRecaptchaToken = getRecaptchaToken;
    
    // Load reCAPTCHA on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        loadRecaptcha().catch(err => console.warn('reCAPTCHA preload failed:', err));
      });
    } else {
      loadRecaptcha().catch(err => console.warn('reCAPTCHA preload failed:', err));
    }
  })();

  /* ------------------------------------------------------------------------
   * PDF Download Functionality
   * --------------------------------------------------------------------- */
  (() => {
    const PDF_WEBHOOK_URL = 'https://duphakepak.beget.app/webhook-test/7ad16972-c30c-46a5-9970-fdcbb0d4c916';
    const HUBSPOT_WEBHOOK_URL = 'https://duphakepak.beget.app/webhook/694308a2-dbf3-466e-bb17-aeba183a1488';

    // Collect calculator data for PDF
    const collectCalculatorData = () => {
      if (!window.calcGetInputs || !window.calcGetResults) {
        return null;
      }
      
      const inputs = window.calcGetInputs();
      const results = window.calcGetResults();

      if (!inputs || !results) {
        return null;
      }

      return {
        inputs: {
          agents: inputs.agents || 0,
          salary: inputs.salary || 0,
          ticketsPerMonth: inputs.ticketsPerMonth || 0,
          deflection: inputs.deflection || 0,
          growth: inputs.growth || 0,
        },
        results: {
          savingsYear: results.year1?.savings || 0,
          savingsThreeYears: results.totalSavings3Years || 0,
          roiPercent: results.year1?.savings && results.year1?.costWithoutQueryPal 
            ? (results.year1.savings / results.year1.costWithoutQueryPal) * 100 
            : 0,
          costWithout: {
            year1: results.year1?.costWithoutQueryPal || 0,
            year2: results.year2?.costWithoutQueryPal || 0,
            year3: results.year3?.costWithoutQueryPal || 0,
          },
          costWith: {
            year1: results.year1?.costWithQueryPal || 0,
            year2: results.year2?.costWithQueryPal || 0,
            year3: results.year3?.costWithQueryPal || 0,
          },
          ticketsSolved: {
            year1: results.year1?.ticketsSolvedByAI || 0,
            year2: results.year2?.ticketsSolvedByAI || 0,
            year3: results.year3?.ticketsSolvedByAI || 0,
          },
        },
      };
    };

    // Send data to HubSpot (fire and forget, no error handling)
    const sendToHubSpot = (formData) => {
      fetch(HUBSPOT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          email: formData.email,
          company: formData.company || '',
        }),
      }).catch((error) => {
        // Silently fail - user doesn't need to know
        console.warn('HubSpot submission failed:', error);
      });
    };

    // Generate and download PDF (formData and recaptchaToken are optional)
    const generatePDF = async (formData = null, recaptchaToken = null) => {
      try {
        // Trigger recalculation to ensure data is up-to-date
        if (typeof window.calcRecalculate === 'function') {
          window.calcRecalculate();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (!window.calcLastResults || !window.calcLastResults.year1) {
            throw new Error('Calculator results not available. Please ensure all fields are filled correctly.');
          }
        } else {
          if (!window.calcLastResults) {
            throw new Error('Calculator has not been run. Please fill in the calculator first.');
          }
        }
        
        // Collect calculator data
        const calculatorData = collectCalculatorData();
        if (!calculatorData) {
          throw new Error('Calculator data not available. Please fill in the calculator and try again.');
        }

        // Prepare payload for n8n (n8n webhook wraps POST body in $json.body)
        // In n8n: $json.body.recaptchaToken will contain the token
        const payload = {
          ...calculatorData,
        };
        
        // Add reCAPTCHA token if available
        if (recaptchaToken) {
          payload.recaptchaToken = recaptchaToken;
        }

        // Show loading state
        const popup = document.getElementById('calc-download-popup');
        const submitBtn = document.getElementById('calc-form-submit-btn');
        const originalBtnText = submitBtn ? submitBtn.textContent : '';
        
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Generating PDF...';
        }

        // Send to n8n for PDF generation
        const response = await fetch(PDF_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage += ` - ${errorText}`;
            }
          } catch (e) {
            // Ignore error reading response
          }
          throw new Error(errorMessage);
        }

        // Get PDF blob
        const blob = await response.blob();
        
        if (blob.size === 0) {
          throw new Error('Received empty PDF file from server');
        }
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `QueryPal-ROI-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show success message (optional - only if popup exists)
        if (popup) {
          const messageEl = popup.querySelector('.calc-download-message') || document.createElement('div');
          messageEl.className = 'calc-download-message';
          messageEl.textContent = 'Your download will start shortly...';
          messageEl.style.cssText = 'padding: 16px; background: #d4edda; color: #155724; border-radius: 8px; margin-top: 16px;';
          if (!popup.querySelector('.calc-download-message')) {
            popup.appendChild(messageEl);
          }
        }

        // Reset form and re-enable buttons after short delay
        // Popup closing is handled by Webflow animations
        setTimeout(() => {
          if (popup) {
            // Reset form
            const form = popup.querySelector('form');
            if (form) form.reset();
            // Remove message
            const messageEl = popup.querySelector('.calc-download-message');
            if (messageEl) messageEl.remove();
          }
          // Re-enable buttons
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
          if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.textContent = downloadBtn.dataset.originalText || originalBtnText;
          }
        }, 1500);

      } catch (error) {
        // Show error message
        const popup = document.getElementById('calc-download-popup');
        const submitBtn = document.getElementById('calc-form-submit-btn');
        const originalBtnText = submitBtn ? submitBtn.textContent : '';
        
        let errorMessage = 'An error occurred while downloading the file. Please try again later.';
        if (error.message) {
          if (error.message.includes('Calculator data not available')) {
            errorMessage = 'Please fill in the calculator fields before downloading the report.';
          } else if (error.message.includes('HTTP error')) {
            errorMessage = 'Server error. Please try again in a few moments.';
          } else if (error.message.includes('empty PDF')) {
            errorMessage = 'The server returned an empty file. Please try again.';
          }
        }
        
        if (popup) {
          const messageEl = popup.querySelector('.calc-download-message') || document.createElement('div');
          messageEl.className = 'calc-download-message';
          messageEl.textContent = errorMessage;
          messageEl.style.cssText = 'padding: 16px; background: #f8d7da; color: #721c24; border-radius: 8px; margin-top: 16px;';
          if (!popup.querySelector('.calc-download-message')) {
            popup.appendChild(messageEl);
          }
        } else {
          alert(errorMessage);
        }

        // Re-enable button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const firstNameEl = document.getElementById('calc-form-first-name');
      const emailEl = document.getElementById('calc-form-email');
      const companyEl = document.getElementById('calc-form-company');

      const firstName = firstNameEl ? firstNameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const company = companyEl ? companyEl.value.trim() : '';

      // Form validation
      if (firstNameEl && emailEl) {
        if (!firstName || !email) {
          alert('Please fill in First Name and Email fields');
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert('Please enter a valid email address');
          return;
        }
      }

      const formData = firstName && email ? {
        firstName,
        email,
        company,
      } : null;

      // Get reCAPTCHA token before submission
      let recaptchaToken = null;
      if (window.getRecaptchaToken) {
        try {
          recaptchaToken = await window.getRecaptchaToken('download_pdf');
        } catch (error) {
          // Continue without token if reCAPTCHA fails (graceful degradation)
        }
      }

      // Send to HubSpot (fire and forget)
      if (formData) {
        sendToHubSpot(formData);
      }

      // Generate PDF
      generatePDF(formData, recaptchaToken);
    };

    // Initialize PDF download functionality
    const initPDFDownload = () => {
      // Form submission
      setTimeout(() => {
        const form = document.getElementById('calc-download-popup')?.querySelector('form');
        if (form) {
          form.addEventListener('submit', (e) => {
            handleFormSubmit(e);
          });
        }

        // Submit button click
        const submitBtn = document.getElementById('calc-form-submit-btn');
        if (submitBtn) {
          submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFormSubmit(e);
          });
        }

        // Hide Webflow form button if it exists
        const webflowSubmitBtn = document.querySelector('#calc-download-popup form [type="submit"]');
        if (webflowSubmitBtn && webflowSubmitBtn !== submitBtn) {
          webflowSubmitBtn.style.display = 'none';
        }
      }, 500);
    };

    // Expose functions to global scope for calculator access
    window.calcGetInputs = () => {
      // Access inputs from ROI calculator
      const agentsEl = document.getElementById('calc-agents-input');
      const salaryEl = document.getElementById('calc-salary-input');
      const ticketsEl = document.getElementById('calc-tickets-input');
      const deflectionEl = document.getElementById('calc-deflection-output');
      
      const extractNumber = (element) => {
        if (!element) return 0;
        const text = element.value || element.textContent || element.innerText || '0';
        const cleaned = text.toString().replace(/[^0-9.-]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      };

      const agents = extractNumber(agentsEl);
      const salary = extractNumber(salaryEl);
      const ticketsPerMonth = extractNumber(ticketsEl);
      const deflection = extractNumber(deflectionEl);
      
      // Get growth rate
      let growth = 0;
      const growthRadioIds = ['calc-growth-0', 'calc-growth-25', 'calc-growth-50', 'calc-growth-75', 'calc-growth-100'];
      for (const radioId of growthRadioIds) {
        const radio = document.getElementById(radioId);
        if (radio && radio.checked) {
          const idMatch = radioId.match(/calc-growth-(\d+)/);
          if (idMatch) {
            growth = parseFloat(idMatch[1]) || 0;
            break;
          }
        }
      }

      return { agents, salary, ticketsPerMonth, deflection, growth };
    };

    window.calcGetResults = () => {
      // This will be set by the calculator after calculation
      return window.calcLastResults || null;
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPDFDownload);
    } else {
      initPDFDownload();
    }
  })();
})();

