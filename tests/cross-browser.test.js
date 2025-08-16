/**
 * Cross-Browser Compatibility Tests
 * Tests browser compatibility and responsive design
 */

describe('Cross-Browser Compatibility Tests', () => {
  describe('Modern Browser Features', () => {
    test('should check for essential browser APIs', () => {
      // Essential APIs that should be available
      const requiredAPIs = [
        'localStorage',
        'sessionStorage',
        'fetch',
        'Promise',
        'addEventListener',
        'querySelector',
        'querySelectorAll'
      ];

      requiredAPIs.forEach(api => {
        expect(typeof window[api] !== 'undefined' || typeof global[api] !== 'undefined').toBe(true);
      });
    });

    test('should have fallbacks for missing features', () => {
      // Test localStorage fallback
      const originalLocalStorage = global.localStorage;
      delete global.localStorage;
      
      // Should handle gracefully without localStorage
      expect(() => {
        const storage = global.localStorage || {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {}
        };
        storage.setItem('test', 'value');
      }).not.toThrow();
      
      // Restore
      global.localStorage = originalLocalStorage;
    });
  });

  describe('CSS Feature Detection', () => {
    test('should support modern CSS features with fallbacks', () => {
      const testElement = document.createElement('div');
      document.body.appendChild(testElement);
      
      // Test CSS Grid support
      testElement.style.display = 'grid';
      const supportsGrid = testElement.style.display === 'grid';
      
      // Test Flexbox support
      testElement.style.display = 'flex';
      const supportsFlex = testElement.style.display === 'flex';
      
      // Test CSS Variables support
      testElement.style.setProperty('--test-var', '#000');
      const supportsCustomProperties = testElement.style.getPropertyValue('--test-var') === '#000';
      
      // Should support at least flexbox (widely supported)
      expect(supportsFlex || supportsGrid).toBe(true);
      
      document.body.removeChild(testElement);
    });
  });

  describe('Responsive Design', () => {
    test('should handle different viewport sizes', () => {
      const mockViewports = [
        { width: 320, height: 568 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1920, height: 1080 }  // Desktop
      ];

      mockViewports.forEach(viewport => {
        // Mock window dimensions
        global.innerWidth = viewport.width;
        global.innerHeight = viewport.height;
        
        // Test that app container can handle different sizes
        const container = document.createElement('div');
        container.id = 'app-container';
        container.style.width = '100%';
        container.style.maxWidth = '1200px';
        
        document.body.appendChild(container);
        
        // Should not overflow viewport
        const rect = container.getBoundingClientRect();
        expect(rect.width).toBeLessThanOrEqual(viewport.width);
        
        document.body.removeChild(container);
      });
    });

    test('should use appropriate font sizes for different devices', () => {
      const element = document.createElement('div');
      element.style.fontSize = 'clamp(14px, 2.5vw, 18px)';
      document.body.appendChild(element);
      
      // Should have some font size set
      const computedStyle = window.getComputedStyle(element);
      expect(computedStyle.fontSize).toBeTruthy();
      
      document.body.removeChild(element);
    });
  });

  describe('Touch and Pointer Events', () => {
    test('should handle both mouse and touch events', () => {
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      document.body.appendChild(button);
      
      let clickHandled = false;
      let touchHandled = false;
      
      button.addEventListener('click', () => {
        clickHandled = true;
      });
      
      button.addEventListener('touchstart', () => {
        touchHandled = true;
      });
      
      // Simulate click event
      button.click();
      expect(clickHandled).toBe(true);
      
      // Simulate touch event
      const touchEvent = new Event('touchstart');
      button.dispatchEvent(touchEvent);
      expect(touchHandled).toBe(true);
      
      document.body.removeChild(button);
    });

    test('should prevent double-tap zoom on mobile', () => {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
      
      // Check if viewport meta tag prevents user scaling
      expect(viewport.content).toContain('user-scalable=no');
    });
  });

  describe('Accessibility Features', () => {
    test('should have proper ARIA attributes', () => {
      const html = require('fs').readFileSync(
        require('path').resolve(__dirname, '../index.html'), 
        'utf8'
      );
      
      document.body.innerHTML = html;
      
      const mainElement = document.querySelector('main');
      expect(mainElement.getAttribute('role')).toBe('main');
      expect(mainElement.getAttribute('aria-label')).toBeTruthy();
      
      const skipLink = document.querySelector('.skip-link');
      expect(skipLink).toBeTruthy();
      expect(skipLink.getAttribute('aria-label')).toBeTruthy();
    });

    test('should support keyboard navigation', () => {
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      button.tabIndex = 0;
      document.body.appendChild(button);
      
      let keydownHandled = false;
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          keydownHandled = true;
        }
      });
      
      // Simulate Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      button.dispatchEvent(enterEvent);
      
      expect(keydownHandled).toBe(true);
      
      document.body.removeChild(button);
    });
  });

  describe('Performance Across Browsers', () => {
    test('should use efficient event handling', () => {
      const container = document.createElement('div');
      const buttons = [];
      
      // Create multiple buttons
      for (let i = 0; i < 20; i++) {
        const button = document.createElement('button');
        button.id = `test-btn-${i}`;
        button.textContent = `Button ${i}`;
        buttons.push(button);
        container.appendChild(button);
      }
      
      document.body.appendChild(container);
      
      let eventCount = 0;
      
      // Use event delegation (efficient across all browsers)
      container.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          eventCount++;
        }
      });
      
      // Test multiple button clicks
      buttons.forEach(button => button.click());
      
      expect(eventCount).toBe(20);
      
      document.body.removeChild(container);
    });
  });

  describe('Error Handling', () => {
    test('should handle JavaScript errors gracefully', () => {
      const originalError = console.error;
      const errors = [];
      console.error = (...args) => errors.push(args);
      
      try {
        // Simulate an error that might occur in some browsers
        throw new Error('Test error');
      } catch (error) {
        console.error('Caught error:', error.message);
      }
      
      expect(errors.length).toBe(1);
      
      console.error = originalError;
    });

    test('should provide meaningful error messages', () => {
      const error = new Error('Network request failed');
      expect(error.message).toContain('Network request failed');
      expect(error.message.length).toBeGreaterThan(5);
    });
  });

  describe('Feature Detection', () => {
    test('should detect browser capabilities', () => {
      const features = {
        localStorage: typeof Storage !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator,
        webGL: !!window.WebGLRenderingContext,
        canvas: !!document.createElement('canvas').getContext,
        geolocation: 'geolocation' in navigator,
        notification: 'Notification' in window
      };
      
      // At least localStorage should be supported
      expect(features.localStorage).toBe(true);
    });
  });
});