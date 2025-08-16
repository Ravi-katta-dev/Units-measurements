// User Interface Module
// Handles modal management, animations, responsive design, and theme control

/* global Utils */

class UI {
  constructor() {
    // Prevent duplicate initialization
    if (UI.instance) {
      return UI.instance;
    }
    
    this.modals = new Map();
    this.toasts = [];
    this.animationQueue = [];
    this.theme = localStorage.getItem('theme') || 'light';
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
    
    // Store singleton instance
    UI.instance = this;
  }

  // Initialize UI controller
  init() {
    this.setupTheme();
    this.setupResponsiveHandlers();
    this.setupAccessibilityHandlers();
    this.setupAnimationController();
    console.log('UI module initialized');
  }

  // Modal Management
  createModal(config) {
    const modalId = config.id || `modal-${Date.now()}`;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = modalId;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', `${modalId}-title`);
    
    if (config.ariaDescribedBy) {
      modal.setAttribute('aria-describedby', config.ariaDescribedBy);
    }

    modal.innerHTML = `
      <div class="modal-backdrop" aria-hidden="true"></div>
      <div class="modal-content" role="document">
        <div class="modal-header">
          <h2 id="${modalId}-title" class="modal-title">${config.title || 'Modal'}</h2>
          <button type="button" class="modal-close" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          ${config.content || ''}
        </div>
        <div class="modal-footer">
          ${config.footer || ''}
        </div>
      </div>
    `;

    // Add event listeners
    const closeButton = modal.querySelector('.modal-close');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    const closeModal = () => this.closeModal(modalId);
    
    closeButton.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // Escape key handling
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    modal.addEventListener('keydown', handleKeydown);

    // Store modal reference
    this.modals.set(modalId, {
      element: modal,
      config,
      closeHandler: closeModal,
      keyHandler: handleKeydown
    });

    return modalId;
  }

  showModal(modalId) {
    const modal = this.modals.get(modalId);
    if (!modal) return false;

    // Store previously focused element
    modal.previousFocus = document.activeElement;

    // Add to DOM
    const container = document.getElementById('modal-container') || document.body;
    container.appendChild(modal.element);

    // Show with animation
    requestAnimationFrame(() => {
      modal.element.classList.add('modal--active');
      
      // Focus first focusable element or close button
      const focusableElements = modal.element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    });

    // Trap focus within modal
    this.trapFocus(modal.element);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return true;
  }

  closeModal(modalId) {
    const modal = this.modals.get(modalId);
    if (!modal) return false;

    // Animate out
    modal.element.classList.add('modal--closing');
    
    setTimeout(() => {
      // Remove from DOM
      if (modal.element.parentNode) {
        modal.element.parentNode.removeChild(modal.element);
      }
      
      // Restore focus
      if (modal.previousFocus) {
        modal.previousFocus.focus();
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Remove from map
      this.modals.delete(modalId);
      
      // Call callback if provided
      if (modal.config.onClose) {
        modal.config.onClose();
      }
    }, this.reducedMotion ? 0 : 300);

    return true;
  }

  // Toast Notifications
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    const toastId = `toast-${Date.now()}`;
    toast.id = toastId;
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const icons = {
      success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg>',
      error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button type="button" class="toast-close" aria-label="Close notification">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    // Add close functionality
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => this.removeToast(toastId));

    // Add to container
    const container = document.getElementById('toast-container') || document.body;
    container.appendChild(toast);

    // Show with animation
    requestAnimationFrame(() => {
      toast.classList.add('toast--show');
    });

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => this.removeToast(toastId), duration);
    }

    this.toasts.push({ id: toastId, element: toast, type });
    return toastId;
  }

  removeToast(toastId) {
    const toastIndex = this.toasts.findIndex(t => t.id === toastId);
    if (toastIndex === -1) return;

    const toast = this.toasts[toastIndex];
    toast.element.classList.add('toast--hide');

    setTimeout(() => {
      if (toast.element.parentNode) {
        toast.element.parentNode.removeChild(toast.element);
      }
      this.toasts.splice(toastIndex, 1);
    }, this.reducedMotion ? 0 : 300);
  }

  // Animation Controller
  setupAnimationController() {
    // Respect user's motion preferences
    if (this.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
  }

  animate(element, animation, options = {}) {
    if (this.reducedMotion && !options.force) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const animationName = `animate-${animation}`;
      element.classList.add(animationName);

      const handleAnimationEnd = () => {
        element.classList.remove(animationName);
        element.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      };

      element.addEventListener('animationend', handleAnimationEnd);

      // Fallback timeout
      setTimeout(() => {
        if (element.classList.contains(animationName)) {
          handleAnimationEnd();
        }
      }, options.duration || 1000);
    });
  }

  // Theme Controller
  setupTheme() {
    document.body.setAttribute('data-theme', this.theme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    this.theme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme color meta tag
    const themeColor = theme === 'dark' ? '#1a1a1a' : '#1FB8CD';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }

  // Responsive Handler
  setupResponsiveHandlers() {
    const handleResize = Utils.debounce(() => {
      this.handleResponsiveLayout();
    }, 250);

    window.addEventListener('resize', handleResize);
    this.handleResponsiveLayout(); // Initial call
  }

  handleResponsiveLayout() {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Update CSS custom properties for responsive design
    document.documentElement.style.setProperty('--viewport-width', `${viewport.width}px`);
    document.documentElement.style.setProperty('--viewport-height', `${viewport.height}px`);

    // Handle mobile-specific adjustments
    if (viewport.width < 768) {
      document.body.classList.add('mobile-layout');
    } else {
      document.body.classList.remove('mobile-layout');
    }

    // Adjust modal sizes for mobile
    this.modals.forEach((modal) => {
      if (viewport.width < 768) {
        modal.element.classList.add('modal--mobile');
      } else {
        modal.element.classList.remove('modal--mobile');
      }
    });
  }

  // Accessibility Handlers
  setupAccessibilityHandlers() {
    // High contrast mode detection
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    highContrastQuery.addEventListener('change', (e) => {
      document.body.classList.toggle('high-contrast', e.matches);
    });

    // Reduced motion detection
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      this.setupAnimationController();
    });
  }

  // Focus Management
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
  }

  // Loading States
  showLoading(element, message = 'Loading...') {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
      <div class="loading-spinner" role="status" aria-label="${message}">
        <div class="spinner"></div>
        <span class="loading-text">${message}</span>
      </div>
    `;

    element.style.position = 'relative';
    element.appendChild(loader);

    return loader;
  }

  hideLoading(element) {
    const loader = element.querySelector('.loading-overlay');
    if (loader) {
      loader.remove();
    }
  }

  // Skeleton Screens
  createSkeleton(config) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-container';
    skeleton.setAttribute('aria-hidden', 'true');

    let content = '';
    
    if (config.lines) {
      for (let i = 0; i < config.lines; i++) {
        const width = config.widths ? config.widths[i] || '100%' : '100%';
        content += `<div class="skeleton-line" style="width: ${width}"></div>`;
      }
    }

    if (config.custom) {
      content = config.custom;
    }

    skeleton.innerHTML = content;
    return skeleton;
  }

  // Utility Methods
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  scrollToElement(element, options = {}) {
    const defaultOptions = {
      behavior: this.reducedMotion ? 'instant' : 'smooth',
      block: 'center',
      inline: 'nearest'
    };

    element.scrollIntoView({ ...defaultOptions, ...options });
  }

  // Cleanup method
  destroy() {
    // Close all modals
    this.modals.forEach((modal, id) => {
      this.closeModal(id);
    });

    // Remove all toasts
    this.toasts.forEach((toast) => {
      this.removeToast(toast.id);
    });

    console.log('UI module destroyed');
  }
}

// Export for browser use - attach to window object
window.UI = UI;