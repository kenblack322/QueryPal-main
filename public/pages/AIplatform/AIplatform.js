(() => {
  if (typeof window === 'undefined') return;

  /* ------------------------------------------------------------------------
   * Zendesk login helpers
   * --------------------------------------------------------------------- */
  window.addEventListener('load', () => {
    const elements = document.querySelectorAll('[data-zendesk-submit]');

    elements.forEach((element) => {
      element.disabled = false;
      element.style.background = '#03363d';
    });

    const forms = document.querySelectorAll('[data-zendesk-form]');
    forms.forEach((form) => {
      form.addEventListener('submit', () => {
        /* Intentionally left blank: rely on default form submission */
      });
    });
  });

  /* ------------------------------------------------------------------------
   * Safe static-content search
   * --------------------------------------------------------------------- */
  (() => {
    const norm = (value) =>
      (value || '')
        .toString()
        .toLowerCase()
        .normalize('NFC')
        .replace(/\s+/g, ' ')
        .trim();

    const highlightTextNodes = (element, query) => {
      if (!element || !query) return;

      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const parent = node.parentElement;
            if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        },
      );

      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }

      const normalizedQuery = norm(query);

      textNodes.forEach((textNode) => {
        const text = textNode.textContent;
        const normalizedText = norm(text);

        if (normalizedText.includes(normalizedQuery)) {
          const parent = textNode.parentElement;
          if (parent && !parent.hasAttribute('data-highlighted')) {
            parent.setAttribute('data-highlighted', 'true');
            parent.style.backgroundColor = '#ffff00';
            parent.style.padding = '1px 2px';
            parent.style.borderRadius = '2px';
          }
        }
      });
    };

    const clearHighlight = (element) => {
      if (!element) return;

      const highlightedElements = element.querySelectorAll('[data-highlighted="true"]');
      highlightedElements.forEach((el) => {
        el.removeAttribute('data-highlighted');
        el.style.backgroundColor = '';
        el.style.padding = '';
        el.style.borderRadius = '';
      });
    };

    const debounce = (fn, ms = 150) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), ms);
      };
    };

    const setupScope = (input) => {
      let tabPane = input.closest('.w-tab-pane, [role="tabpanel"], .tab-pane');

      if (!tabPane) {
        let parent = input.parentElement;
        while (parent && parent !== document.body) {
          if (
            parent.classList.contains('w-tab-pane') ||
            parent.getAttribute('role') === 'tabpanel' ||
            parent.classList.contains('tab-pane')
          ) {
            tabPane = parent;
            break;
          }
          parent = parent.parentElement;
        }
      }

      if (!tabPane) return;

      const getItems = () =>
        Array.from(
          tabPane.querySelectorAll('[data-search-item], .search-item, .w-dyn-item, .item'),
        );

      const emptyState =
        tabPane.querySelector('[data-search-empty], .search-empty, .empty-state') || null;

      const apply = () => {
        const query = norm(input.value);
        let visible = 0;
        clearHighlight(tabPane);

        getItems().forEach((item) => {
          const text = item.textContent || '';
          const match = query === '' || norm(text).includes(query);

          item.style.display = match ? '' : 'none';

          if (match && query !== '') {
            highlightTextNodes(item, query);
          }

          if (match) visible += 1;
        });

        if (emptyState) {
          emptyState.style.display = visible === 0 ? '' : 'none';
        }
      };

      input.addEventListener('input', debounce(apply, 150));
      input.addEventListener('search', apply);
      input.addEventListener('keyup', debounce(apply, 150));

      const tabsRoot = tabPane.closest('.w-tabs, .tabs');
      if (tabsRoot) {
        tabsRoot.addEventListener('click', (event) => {
          if (
            event.target &&
            (event.target.classList.contains('w-tab-link') ||
              event.target.getAttribute('role') === 'tab' ||
              event.target.closest('.w-tab-link'))
          ) {
            setTimeout(apply, 100);
          }
        });

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === 'attributes' &&
              (mutation.attributeName === 'class' || mutation.attributeName === 'style')
            ) {
              setTimeout(apply, 50);
            }
          });
        });

        observer.observe(tabPane, {
          attributes: true,
          attributeFilter: ['class', 'style'],
        });
      }

      setTimeout(apply, 100);
    };

    const initSearch = () => {
      const searchInputs = document.querySelectorAll(
        `
        [data-search="input"],
        input[type="search"],
        input[placeholder*="search" i],
        .search-input,
        .w-input[type="text"]
      `,
      );

      searchInputs.forEach((input) => {
        setupScope(input);
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSearch);
    } else {
      setTimeout(initSearch, 500);
    }

    setTimeout(initSearch, 2000);
  })();

  /* ------------------------------------------------------------------------
   * Tab switching helper
   * --------------------------------------------------------------------- */
  (() => {
    const switchToTab = (tabName) => {
      const allTabs = document.querySelectorAll('.w-tabs');

      allTabs.forEach((tabsContainer) => {
        const tabButton = tabsContainer.querySelector(`[data-tab="${tabName}"]`);

        if (tabButton) {
          tabButton.click();
        }
      });
    };

    const initTabSwitching = () => {
      const tabLinks = document.querySelectorAll('a[data-tab-link], [data-tab-link]:not(.w-tab-link)');
      tabLinks.forEach((link, index) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();

          const targetTab = link.getAttribute('data-tab-link');

          if (targetTab) {
            switchToTab(targetTab);
          }
        });
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTabSwitching);
    } else {
      setTimeout(initTabSwitching, 500);
    }

    setTimeout(initTabSwitching, 2000);
  })();
})();


