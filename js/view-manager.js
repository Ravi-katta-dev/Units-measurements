// View Manager Module
// Handles view switching, component loading, and UI state management

class ViewManager {
  constructor({ stateManager = null, questionManager = null, testManager = null } = {}) {
    this.currentView = 'landing';
    this.views = ['landing', 'test', 'result', 'review-answers'];
    this.componentCache = {};
    // allow optional DI; fall back to window.* if not provided
    this.stateManager = stateManager || (window.app && window.app.stateManager) || window.stateManager || null;
    this.questionManager = questionManager || (window.app && window.app.questionManager) || window.questionManager || null;
    this.testManager = testManager || (window.app && window.app.testManager) || window.testManager || null;
    this.reviewManager = null;
  }

  // Initialize view manager
  async init() {
    try {
      // Load initial components
      await this.loadAllComponents();
      this.showView('landing');
    } catch (error) {
      console.error('ViewManager initialization error:', error);
    }
  }

  // Load all view components
  async loadAllComponents() {
    const componentPromises = [
      this.loadComponent('landing-view'),
      this.loadComponent('test-view'),
      this.loadComponent('result-view'),
      this.loadComponent('review-answers-view'),
      this.loadComponent('review-panel')
    ];

    try {
      await Promise.all(componentPromises);
    } catch (error) {
      console.error('Error loading components:', error);
      throw error;
    }
  }

  // Load a single component
  async loadComponent(componentName) {
    if (this.componentCache[componentName]) {
      return this.componentCache[componentName];
    }

    try {
      const response = await fetch(`components/${componentName}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${componentName} (${response.status})`);
      }

      const html = await response.text();
      this.componentCache[componentName] = html;

      // Insert component into DOM if it's a view or panel
      if (componentName.includes('view') || componentName === 'review-panel') {
        const container = document.getElementById('app-container');
        if (container) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;

          const componentElement = tempDiv.firstElementChild;
          if (componentElement) {
            if (componentName.includes('view') && !componentElement.id) {
              componentElement.id = componentName;
            }

            const existingComponent = document.getElementById(componentElement.id);
            if (existingComponent) {
              existingComponent.replaceWith(componentElement);
            } else {
              container.appendChild(componentElement);
            }

            this.initializeComponent(componentName, componentElement);
          }
        }
      }

      return html;
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);

      if (componentName.includes('view')) {
        return this.createFallbackView(componentName);
      }

      throw error;
    }
  }

  // REPLACEMENT: initializeReviewAnswersView to call the correct ReviewAnswersManager
  initializeReviewAnswersView(element) {
    try {
      // Bind back to results button
      const backBtn = element.querySelector('#back-to-results-btn');
      if (backBtn && backBtn.dataset.bound !== 'true') {
        backBtn.addEventListener('click', () => this.showView('result'));
        backBtn.dataset.bound = 'true';
      }

      // Bind jump-to-question handler (delegated for list items)
      const sidebarList = element.querySelector('#reviewSidebarList');
      if (sidebarList && sidebarList.dataset.delegationBound !== 'true') {
        sidebarList.addEventListener('click', (e) => {
          const btn = e.target.closest('li');
          if (btn) {
            const idx = Array.from(sidebarList.children).indexOf(btn);
            if (!Number.isNaN(idx)) {
              this.stateManager.setReviewCurrentQuestion(idx);
              if (this.reviewManager) {
                this.reviewManager.loadReviewQuestion(idx);
              }
              this.reviewManager.closeSidebar();
            }
          }
        });
        sidebarList.dataset.delegationBound = 'true';
      }

      // Initialize review manager
      this.initializeReviewManager(element);
    } catch (error) {
      console.error('initializeReviewAnswersView error:', error);
    }
  }

  // NEW: initializeReviewManager
  initializeReviewManager(element) {
    try {
      const stateManager = this.stateManager || window.app.stateManager;
      const questionManager = this.questionManager || window.app.questionManager;
      if (!stateManager || !questionManager) return;

      if (!this.reviewManager) {
        this.reviewManager = new ReviewAnswersManager();
      }

      const testResults = stateManager.getTestResults();
      const questions = questionManager.getQuestions();

      this.reviewManager.initialize(testResults, questions, element);
    } catch (error) {
      console.error('Error initializing review manager:', error);
    }
  }

  // Show specific view
  showView(viewName) {
    try {
      this.views.forEach(view => {
        const element = document.getElementById(`${view}-view`);
        if (element) {
          element.classList.remove('active');
        }
      });

      const targetView = document.getElementById(`${viewName}-view`);
      if (targetView) {
        targetView.classList.add('active');
        this.currentView = viewName;

        this.onViewActivated(viewName, targetView);
      } else {
        console.error(`View ${viewName} not found in DOM`);
        this.loadComponent(`${viewName}-view`).then(() => {
          const retryView = document.getElementById(`${viewName}-view`);
          if (retryView) {
            retryView.classList.add('active');
            this.currentView = viewName;
            this.onViewActivated(viewName, retryView);
          }
        }).catch(error => {
          console.error(`Failed to reload component ${viewName}-view:`, error);
        });
      }
    } catch (error) {
      console.error('Show view error:', error);
    }
  }

  onViewActivated(viewName, element) {
    try {
      switch (viewName) {
        case 'test':
          if (this.testManager) {
            this.testManager.updateQuestionDisplay?.();
          }
          break;
        case 'result':
          if (this.testManager) {
            this.testManager.calculateResults?.();
          }
          break;
        case 'review-answers':
          if (this.testManager && typeof this.testManager.initializeReview === 'function') {
            this.testManager.initializeReview(element);
          } else {
            this.initializeReviewManager(element);
          }
          break;
      }
    } catch (error) {
      console.error(`Error in view activation for ${viewName}:`, error);
    }
  }
}
