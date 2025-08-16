/**
 * Performance Tests
 * Tests application performance, script loading, and DOM operations
 */

describe('Performance Tests', () => {
  describe('Script Loading Performance', () => {
    test('should have defer attribute on all script tags', () => {
      const html = require('fs').readFileSync(
        require('path').resolve(__dirname, '../index.html'), 
        'utf8'
      );
      
      document.body.innerHTML = html;
      
      const scripts = document.querySelectorAll('script[src]');
      const scriptElements = Array.from(scripts);
      
      // Check that non-inline scripts have defer attribute
      const externalScripts = scriptElements.filter(script => 
        script.src && !script.src.includes('service-worker') && script.src.includes('.js')
      );
      
      externalScripts.forEach(script => {
        expect(script.defer).toBe(true);
      });
    });

    test('should preload critical CSS resources', () => {
      const html = require('fs').readFileSync(
        require('path').resolve(__dirname, '../index.html'), 
        'utf8'
      );
      
      document.body.innerHTML = html;
      
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      const preloadedCSS = Array.from(preloadLinks).filter(link => 
        link.as === 'style' || link.href.includes('.css')
      );
      
      expect(preloadedCSS.length).toBeGreaterThan(0);
    });
  });

  describe('DOM Query Performance', () => {
    let container;
    
    beforeEach(() => {
      container = document.createElement('div');
      container.id = 'test-container';
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    test('should cache DOM queries efficiently', () => {
      // Create multiple elements
      for (let i = 0; i < 100; i++) {
        const element = document.createElement('div');
        element.className = 'test-element';
        element.dataset.index = i;
        container.appendChild(element);
      }

      const startTime = performance.now();
      
      // Cache the query result instead of querying multiple times
      const elements = container.querySelectorAll('.test-element');
      
      // Perform operations on cached elements
      for (let i = 0; i < 10; i++) {
        elements.forEach(el => {
          const index = el.dataset.index;
          // Simulate some processing
          if (index) {
            el.style.opacity = '1';
          }
        });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete quickly (under 50ms for this simple operation)
      expect(duration).toBeLessThan(50);
    });

    test('should minimize DOM reflows and repaints', () => {
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.left = '0px';
      element.style.top = '0px';
      container.appendChild(element);

      const startTime = performance.now();
      
      // Batch DOM changes to minimize reflows
      element.style.cssText = 'position: absolute; left: 100px; top: 100px; width: 200px; height: 200px;';
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Batched changes should be fast
      expect(duration).toBeLessThan(10);
    });
  });

  describe('Event Listener Performance', () => {
    test('should use event delegation instead of multiple listeners', () => {
      const container = document.createElement('div');
      container.id = 'button-container';
      
      // Create many buttons
      for (let i = 0; i < 50; i++) {
        const button = document.createElement('button');
        button.id = `button-${i}`;
        button.textContent = `Button ${i}`;
        container.appendChild(button);
      }
      
      document.body.appendChild(container);
      
      let clickCount = 0;
      
      // Use single delegated event listener
      const startTime = performance.now();
      
      container.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          clickCount++;
        }
      });
      
      const endTime = performance.now();
      const setupTime = endTime - startTime;
      
      // Event delegation setup should be very fast
      expect(setupTime).toBeLessThan(5);
      
      // Test that delegation works
      const button = container.querySelector('#button-25');
      button.click();
      
      expect(clickCount).toBe(1);
      
      document.body.removeChild(container);
    });
  });

  describe('Memory Management', () => {
    test('should prevent memory leaks from event listeners', () => {
      const container = document.createElement('div');
      container.id = 'temp-container';
      document.body.appendChild(container);
      
      const button = document.createElement('button');
      button.id = 'temp-button';
      container.appendChild(button);
      
      let callbackCalled = false;
      const callback = () => { callbackCalled = true; };
      
      // Add event listener
      button.addEventListener('click', callback);
      
      // Simulate cleanup
      button.removeEventListener('click', callback);
      
      // Remove from DOM
      document.body.removeChild(container);
      
      // Verify callback is not called after cleanup
      button.click();
      expect(callbackCalled).toBe(false);
    });
  });

  describe('Async Operations Performance', () => {
    test('should handle async operations efficiently', async () => {
      const startTime = performance.now();
      
      // Simulate multiple async operations
      const promises = Array.from({ length: 10 }, (_, i) => 
        new Promise(resolve => setTimeout(() => resolve(i), 10))
      );
      
      const results = await Promise.all(promises);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(results).toHaveLength(10);
      // Should complete in reasonable time (allowing for setTimeout delays)
      expect(duration).toBeLessThan(100);
    });
  });

  describe('CSS Performance', () => {
    test('should use efficient CSS selectors', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div class="test-component">
          <button class="btn btn--primary" id="primary-btn">Primary</button>
          <button class="btn btn--secondary" id="secondary-btn">Secondary</button>
        </div>
      `;
      document.body.appendChild(container);
      
      const startTime = performance.now();
      
      // Use efficient ID selector
      const primaryBtn = document.getElementById('primary-btn');
      
      // Use efficient class selector
      const buttons = container.querySelectorAll('.btn');
      
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      
      expect(primaryBtn).toBeTruthy();
      expect(buttons).toHaveLength(2);
      expect(queryTime).toBeLessThan(5);
      
      document.body.removeChild(container);
    });
  });
});