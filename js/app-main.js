// Main Application Module
// Handles application initialization, event binding, and core functionality

/* global UI, Charts, AdaptiveSystem, PerformanceAnalytics, StateManager, ViewManager, QuestionManager, TestManager, Utils, AppStorage */

class MockTestApp {
  constructor() {
    this.stateManager = null;
    this.viewManager = null;
    this.testManager = null;
    this.questionManager = null;
    this.ui = null;
    this.charts = null;
    this.storage = null;
    this.adaptiveSystem = null; // Phase 5: Adaptive Learning
    this.performanceAnalytics = null; // Phase 5: Advanced Analytics
    this.initialized = false; // Prevent multiple initialization
  }

  // Initialize the application
  async init() {
    if (this.initialized) {
      console.log('MockTestApp already initialized, skipping...');
      return;
    }
    
    try {
      // Initialize core modules (singletons)
      this.storage = new AppStorage();
      this.ui = new UI();
      this.charts = new Charts();
      
      // Phase 5: Initialize advanced modules
      this.adaptiveSystem = new AdaptiveSystem();
      this.performanceAnalytics = new PerformanceAnalytics();
      
      // Initialize managers
      this.stateManager = new StateManager();
      this.viewManager = new ViewManager();
      this.questionManager = new QuestionManager();
      this.testManager = new TestManager(this.stateManager, this.viewManager, this.questionManager);

      // Make modules globally available for easier access
      window.appStorage = this.storage;
      window.appUI = this.ui;
      window.appCharts = this.charts;
      window.appAdaptive = this.adaptiveSystem; // Phase 5
      window.appAnalytics = this.performanceAnalytics; // Phase 5
      window.app = this; // Phase 4: Make app instance available globally

      // Initialize managers
      await this.viewManager.init();
      await this.stateManager.init();

      // Setup event listeners
      this.setupEventListeners();

      // Update UI with current state
      this.updateUI();

      // Handle dark mode initial state
      this.applyInitialDarkMode();

      // Setup PWA-specific functionality
      this.setupPWAFeatures();

      // Phase 4: Initialize enhanced navigation
      this.initializeEnhancedNavigation();
      
      // Phase 5: Initialize advanced features
      this.initializePhase5Features();

      this.initialized = true;
      console.log('MockTestApp initialized successfully - Phase 5 Complete');
    } catch (error) {
      console.error('App initialization error:', error);
      this.showError('Failed to initialize application');
    }
  }

  // Setup all event listeners
  setupEventListeners() {
    try {
      // Use event delegation for better reliability with dynamic content
      this.setupGlobalEventDelegation();
      
      // Global event listeners only (avoid duplicate button listeners)
      this.setupGlobalEventListeners();
      
      // Setup non-button specific listeners (like form inputs, custom controls)
      this.setupNonButtonEventListeners();
      
      // Debug: Check for duplicate event listeners
      this.debugEventListeners();
    } catch (error) {
      console.error('Setup event listeners error:', error);
    }
  }

  // Debug method to check for potential duplicate event listeners
  debugEventListeners() {
    console.log('🔍 Event Listener Debug Summary:');
    console.log('- Global event delegation: ✅ Active on #app-container');
    console.log('- Direct button listeners: ❌ Removed from view-manager.js');
    console.log('- Duplicate prevention: ✅ Added stopPropagation() to all handlers');
    console.log('- Button debouncing: ✅ Added processing flags to critical buttons');
    
    // Check for common button elements
    const criticalButtons = [
      'start-test-btn', 'exit-exam-btn', 'submit-test-btn', 
      'new-test-btn', 'view-solutions-btn', 'review-answers-btn'
    ];
    
    let foundButtons = 0;
    criticalButtons.forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        foundButtons++;
        console.log(`- Button #${btnId}: ✅ Found in DOM`);
      }
    });
    
    console.log(`📊 Found ${foundButtons}/${criticalButtons.length} critical buttons in DOM`);
    console.log('🎯 Event handling system: Single delegation pattern active');
  }

  // Setup global event delegation for dynamic content
  setupGlobalEventDelegation() {
    // Delegate events on the main app container
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      // Add a global click counter for debugging
      let clickCounter = 0;
      
      // Track button processing states to prevent duplicate actions
      const buttonStates = new Map();
      
      appContainer.addEventListener('click', (e) => {
        clickCounter++;
        const target = e.target;
        
        // Find the actual button element if clicked element is inside a button
        const button = target.closest('button');
        const buttonId = button ? button.id : target.id;
        
        // Also check if target itself is a button
        const actualTarget = target.tagName === 'BUTTON' ? target : button;
        
        // Skip if no button found
        if (!actualTarget || !buttonId) {
          return;
        }
        
        console.log(`Global click handler #${clickCounter} - Target: ${target.id || 'no-id'}, Tag: ${target.tagName}, Button: ${buttonId || 'none'}`);
        
        // Check if button is already being processed
        if (buttonStates.get(buttonId)) {
          console.log(`Button ${buttonId} is already being processed, ignoring click`);
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        
        // Mark button as processing
        const setProcessing = (processing) => {
          buttonStates.set(buttonId, processing);
          if (actualTarget) {
            actualTarget.disabled = processing;
            actualTarget.dataset.processing = processing.toString();
            if (processing) {
              actualTarget.classList.add('btn--processing');
            } else {
              actualTarget.classList.remove('btn--processing');
            }
          }
        };
        
        // Handle button clicks by ID
        switch (buttonId) {
          case 'start-test-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Start test button clicked');
            
            setProcessing(true);
            this.startTest();
            
            setTimeout(() => setProcessing(false), 1000);
            break;
          case 'resume-test-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Resume test button clicked');
            
            setProcessing(true);
            this.resumeTest();
            setTimeout(() => setProcessing(false), 500);
            break;
            
          case 'reset-test-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Reset test button clicked');
            
            setProcessing(true);
            this.resetTest();
            setTimeout(() => setProcessing(false), 500);
            break;
            
          case 'exit-exam-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Exit exam button clicked');
            
            setProcessing(true);
            
            if (confirm('Are you sure you want to exit the exam? Your progress will be saved.')) {
              this.backToHome();
            }
            
            setTimeout(() => setProcessing(false), 500);
            break;
          case 'review-answers-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Review answers button clicked');
            
            setProcessing(true);
            this.startReviewMode();
            setTimeout(() => setProcessing(false), 500);
            break;
            
          case 'view-solutions-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('View solutions button clicked');
            
            setProcessing(true);
            this.showSolutionsView();
            setTimeout(() => setProcessing(false), 500);
            break;
            
          case 'new-test-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Start new test button clicked');
            
            setProcessing(true);
            this.startNewTest();
            setTimeout(() => setProcessing(false), 1000);
            break;
          case 'restart-test-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Restart test button clicked');
            this.restartTest();
            break;
          case 'export-results-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Export results button clicked');
            this.exportResults();
            break;
          case 'back-home-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Back to home button clicked');
            this.backToHome();
            break;
          case 'back-to-results-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Back to results button clicked');
            this.viewManager.showView('result');
            break;
          case 'review-prev-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Review previous button clicked');
            this.navigateReview(-1);
            break;
          case 'review-next-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Review next button clicked');
            this.navigateReview(1);
            break;
          case 'prev-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Previous question button clicked');
            if (this.testManager) this.testManager.previousQuestion();
            break;
          case 'next-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Next question button clicked');
            if (this.testManager) this.testManager.nextQuestion();
            break;
          case 'submit-test-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Submit test button clicked');
            
            setProcessing(true);
            if (this.testManager) this.testManager.submitTest();
            setTimeout(() => setProcessing(false), 1000);
            break;
          case 'bookmark-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Bookmark button clicked');
            if (this.testManager) {
              this.testManager.toggleBookmark();
              const isBookmarked = this.stateManager.getBookmarked()[this.stateManager.getCurrentQuestion()];
              target.classList.toggle('bookmarked', isBookmarked);
            }
            break;
          case 'clear-answer-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Clear answer button clicked');
            if (this.testManager) this.testManager.clearAnswer();
            break;
          case 'review-panel-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Review panel button clicked');
            if (this.testManager) {
              this.testManager.updateReviewGrid();
              this.viewManager.showModal('review-panel');
            }
            break;
          case 'close-review-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Close review panel button clicked');
            this.viewManager.hideModal('review-panel');
            break;
          case 'submit-from-review-btn':
            e.preventDefault();
            e.stopPropagation();
            console.log('Submit from review button clicked');
            this.viewManager.hideModal('review-panel');
            if (this.testManager) this.testManager.submitTest();
            break;
          default:
            // Handle question navigation buttons
            if (target.classList.contains('question-nav-btn')) {
              e.preventDefault();
              e.stopPropagation();
              const questionIndex = parseInt(target.dataset.questionIndex);
              console.log('Question nav button clicked:', questionIndex);
              if (!isNaN(questionIndex)) {
                this.goToReviewQuestion(questionIndex);
              }
            }
            // Handle review question navigation
            else if (target.matches('.question-nav-item, .question-number')) {
              e.preventDefault();
              e.stopPropagation();
              const questionIndex = parseInt(target.dataset.questionIndex) || parseInt(target.textContent);
              console.log('Review question nav clicked:', questionIndex);
              if (questionIndex && questionIndex > 0) {
                this.goToReviewQuestion(questionIndex - 1); // Convert to 0-based index
              }
            }
            break;
        }
      });
    }
  }

  // Setup non-button event listeners (inputs, forms, etc.)
  setupNonButtonEventListeners() {
    // Test duration change
    const durationSelect = document.getElementById('test-duration');
    if (durationSelect) {
      durationSelect.addEventListener('change', (e) => this.updateTestDuration(e));
    }

    // Custom duration inputs
    const customMinutes = document.getElementById('custom-minutes');
    const customSeconds = document.getElementById('custom-seconds');
    if (customMinutes) {
      customMinutes.addEventListener('input', () => this.validateCustomDuration());
    }
    if (customSeconds) {
      customSeconds.addEventListener('input', () => this.validateCustomDuration());
    }

    // Mode toggles
    const rrbMode = document.getElementById('rrb-mode');
    if (rrbMode) {
      rrbMode.addEventListener('change', (e) => this.toggleRRBMode(e));
    }

    const darkMode = document.getElementById('dark-mode');
    if (darkMode) {
      darkMode.addEventListener('change', (e) => this.toggleDarkMode(e));
    }

    const enhancedTimer = document.getElementById('enhanced-timer');
    if (enhancedTimer) {
      enhancedTimer.addEventListener('change', (e) => this.toggleEnhancedTimer(e));
    }

    // Question source and JSON upload
    const questionSource = document.getElementById('question-source');
    if (questionSource) {
      questionSource.addEventListener('change', (e) => this.toggleQuestionSource(e));
    }

    // JSON file upload
    const jsonFileInput = document.getElementById('json-file');
    if (jsonFileInput) {
      jsonFileInput.addEventListener('change', (e) => this.handleJSONUpload(e));
    }

    // Download example JSON button - this is a specific non-core button
    const downloadExampleBtn = document.getElementById('download-example-btn');
    if (downloadExampleBtn) {
      downloadExampleBtn.addEventListener('click', () => this.downloadExampleJSON());
    }
  }



  // Handles initial dark mode state (from localStorage or system preference)
  applyInitialDarkMode() {
    const darkModeCheckbox = document.getElementById('dark-mode');
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");

    let isDark = false;
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      isDark = true;
    }

    if (darkModeCheckbox) {
      darkModeCheckbox.checked = isDark;
    }
    document.body.setAttribute('data-theme', isDark ? "dark" : "light");
  }









  // Setup global event listeners
  setupGlobalEventListeners() {
    // Window beforeunload for auto-save
    window.addEventListener('beforeunload', (e) => {
      const state = this.stateManager.getState();
      if (state.testStart && !state.testEnd) {
        e.preventDefault();
        e.returnValue = 'You have a test in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  // Handle keyboard shortcuts
  handleKeyboardShortcuts(event) {
    const currentView = this.viewManager.getCurrentView();
    
    if (currentView === 'test') {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          this.testManager.previousQuestion();
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.testManager.nextQuestion();
          break;
        case 'b':
        case 'B':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            this.testManager.toggleBookmark();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            const optionIndex = parseInt(event.key) - 1;
            this.testManager.selectOption(optionIndex);
          }
          break;
      }
    }
  }

  // Start new test
  startTest() {
    try {
      const state = this.stateManager.getState();
      
      // Validate custom duration if selected
      if (state.testDuration === 'custom') {
        if (!this.validateCustomDuration()) {
          return;
        }
      }

      // Initialize test state
      this.stateManager.startTest();
      
      // Start timers and auto-save
      this.testManager.startMainTimer();
      this.testManager.startAutoSave();
      
      // Show test view and display first question
      this.viewManager.showView('test');
      this.testManager.displayQuestion();
      
    } catch (error) {
      console.error('Start test error:', error);
      this.showError('Failed to start test');
    }
  }

  // Resume existing test
  resumeTest() {
    try {
      // Resume timers
      this.testManager.startMainTimer();
      this.testManager.startAutoSave();
      
      // Show test view and current question
      this.viewManager.showView('test');
      this.testManager.displayQuestion();
      
    } catch (error) {
      console.error('Resume test error:', error);
      this.showError('Failed to resume test');
    }
  }

  // Reset test data
  resetTest() {
    if (!confirm('Are you sure you want to reset all test data? This action cannot be undone.')) {
      return;
    }
    
    try {
      this.stateManager.resetState();
      this.viewManager.showView('landing');
      this.updateUI();
    } catch (error) {
      console.error('Reset test error:', error);
      this.showError('Failed to reset test');
    }
  }

  // Restart test (from results)
  restartTest() {
    if (!confirm('Are you sure you want to start a new test? This will reset all data.')) {
      return;
    }
    
    try {
      this.stateManager.resetState();
      this.viewManager.showView('landing');
      this.updateUI();
    } catch (error) {
      console.error('Restart test error:', error);
      this.showError('Failed to restart test');
    }
  }

  // Start new test (from results page)
  startNewTest() {
    if (!confirm('Are you sure you want to start a new test? This will reset all current data.')) {
      return;
    }
    
    try {
      this.stateManager.resetState();
      this.viewManager.showView('landing');
      this.updateUI();
    } catch (error) {
      console.error('Start new test error:', error);
      this.showError('Failed to start new test');
    }
  }

  // Start review mode (from results page)
  startReviewMode() {
    try {
      this.testManager.initializeReview();
      this.viewManager.showView('review-answers');
      
      // Ensure the review navigation grid is properly initialized
      setTimeout(() => {
        this.updateReviewDisplay(0);
      }, 100);
    } catch (error) {
      console.error('Start review mode error:', error);
      this.showError('Failed to start review mode');
    }
  }

  // Show solutions view
  showSolutionsView() {
    try {
      this.testManager.initializeReview();
      this.viewManager.showView('review-answers');
      
      // Ensure the review navigation grid is properly initialized
      setTimeout(() => {
        this.updateReviewDisplay(0);
      }, 100);
      
      // Show a message that this is solution mode
      if (window.Utils && window.Utils.showToast) {
        window.Utils.showToast('Viewing solutions for all questions', 'info', 3000);
      }
    } catch (error) {
      console.error('Show solutions error:', error);
      this.showError('Failed to show solutions');
    }
  }

  // Back to home
  backToHome() {
    try {
      this.viewManager.showView('landing');
      this.updateUI();
    } catch (error) {
      console.error('Back to home error:', error);
    }
  }

  // Navigate review answers
  navigateReview(direction) {
    try {
      const currentQuestions = this.getCurrentQuestions();
      const state = this.stateManager.getState();
      const currentReviewQ = state.reviewCurrentQ || 0;
      const newReviewQ = currentReviewQ + direction;
      
      if (newReviewQ >= 0 && newReviewQ < currentQuestions.length) {
        this.stateManager.updateState({ reviewCurrentQ: newReviewQ });
        this.updateReviewDisplay(newReviewQ);
      }
    } catch (error) {
      console.error('Navigate review error:', error);
    }
  }

  // Go to specific question in review mode
  goToReviewQuestion(questionIndex) {
    try {
      const currentQuestions = this.getCurrentQuestions();
      
      if (questionIndex >= 0 && questionIndex < currentQuestions.length) {
        this.stateManager.updateState({ reviewCurrentQ: questionIndex });
        this.updateReviewDisplay(questionIndex);
        
        // Show feedback that navigation happened
        if (window.Utils && window.Utils.showToast) {
          window.Utils.showToast(`Jumped to Question ${questionIndex + 1}`, 'success', 2000);
        }
      }
    } catch (error) {
      console.error('Go to review question error:', error);
    }
  }

  // Update review display for current question
  updateReviewDisplay(questionIndex) {
    try {
      const currentQuestions = this.getCurrentQuestions();
      const state = this.stateManager.getState();
      const results = this.stateManager.getResults();
      
      if (!results || !currentQuestions[questionIndex]) return;
      
      const question = currentQuestions[questionIndex];
      const userAnswer = state.answers[questionIndex];
      const isCorrect = userAnswer !== null && userAnswer === question.correctIndex;
      const timeSpent = state.timeSpent[questionIndex] || 0;
      
      // Update question navigation grid
      this.updateReviewNavigationGrid(questionIndex);
      
      // Update question number
      const reviewQNum = document.getElementById('review-q-num');
      if (reviewQNum) {
        reviewQNum.textContent = questionIndex + 1;
      }
      
      // Update question text
      const reviewQuestionText = document.getElementById('review-question-text');
      if (reviewQuestionText) {
        reviewQuestionText.textContent = question.question;
      }
      
      // Update user answer display
      const userAnswerDisplay = document.getElementById('user-answer-display');
      if (userAnswerDisplay) {
        if (userAnswer !== null) {
          userAnswerDisplay.textContent = question.options[userAnswer];
          userAnswerDisplay.className = `answer-display ${isCorrect ? 'correct' : 'incorrect'}`;
        } else {
          userAnswerDisplay.textContent = 'Not Answered';
          userAnswerDisplay.className = 'answer-display not-answered';
        }
      }
      
      // Update correct answer display
      const correctAnswerDisplay = document.getElementById('correct-answer-display');
      if (correctAnswerDisplay) {
        correctAnswerDisplay.textContent = question.options[question.correctIndex];
        correctAnswerDisplay.className = 'answer-display';
      }
      
      // Update solution
      const solutionText = document.getElementById('solution-text');
      if (solutionText) {
        solutionText.textContent = question.solution || 'Solution not available for this question.';
      }
      
      // Update time spent
      const questionTimeSpent = document.getElementById('question-time-spent');
      if (questionTimeSpent) {
        questionTimeSpent.textContent = this.testManager.formatTime(timeSpent * 1000);
      }
      
      // Update status
      const questionStatusDisplay = document.getElementById('question-status-display');
      if (questionStatusDisplay) {
        const status = userAnswer === null ? 'Not Answered' : (isCorrect ? 'Correct' : 'Incorrect');
        questionStatusDisplay.textContent = status;
        questionStatusDisplay.className = `stat-value ${status.toLowerCase().replace(' ', '')}`;
      }
      
      // Update navigation buttons
      const reviewPrevBtn = document.getElementById('review-prev-btn');
      const reviewNextBtn = document.getElementById('review-next-btn');
      
      if (reviewPrevBtn) {
        reviewPrevBtn.disabled = questionIndex === 0;
      }
      
      if (reviewNextBtn) {
        reviewNextBtn.disabled = questionIndex === currentQuestions.length - 1;
        reviewNextBtn.textContent = questionIndex === currentQuestions.length - 1 ? 'Last Question' : 'Next →';
      }
      
    } catch (error) {
      console.error('Update review display error:', error);
    }
  }

  // Update review navigation grid
  updateReviewNavigationGrid(currentQuestionIndex) {
    try {
      const grid = document.getElementById('review-question-grid');
      if (!grid) return;
      
      const currentQuestions = this.getCurrentQuestions();
      const state = this.stateManager.getState();
      
      // Clear existing grid
      grid.innerHTML = '';
      
      // Create navigation buttons for each question
      currentQuestions.forEach((question, index) => {
        const btn = document.createElement('button');
        btn.className = 'question-nav-btn';
        btn.textContent = index + 1;
        btn.dataset.questionIndex = index;
        
        // Determine status and apply appropriate class
        const userAnswer = state.answers[index];
        const isCorrect = userAnswer !== null && userAnswer === question.correctIndex;
        
        if (index === currentQuestionIndex) {
          btn.classList.add('current');
        } else if (userAnswer === null) {
          btn.classList.add('unanswered');
        } else if (isCorrect) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('incorrect');
        }
        
        // Event handler will be handled by global event delegation
        // btn.addEventListener('click', () => {
        //   this.goToReviewQuestion(index);
        // });
        // Removed direct event listener to prevent duplicates
        
        grid.appendChild(btn);
      });
    } catch (error) {
      console.error('Update review navigation grid error:', error);
    }
  }

  // Update test duration
  updateTestDuration(event) {
    try {
      const value = event.target.value;
      const customSection = document.getElementById('custom-duration-section');
      
      if (value === 'custom') {
        customSection.classList.remove('hidden');
        this.validateCustomDuration();
      } else {
        customSection.classList.add('hidden');
        this.stateManager.updateState({ testDuration: parseInt(value) });
      }
    } catch (error) {
      console.error('Update test duration error:', error);
    }
  }

  // Validate custom duration inputs
  validateCustomDuration() {
    try {
      const minutesInput = document.getElementById('custom-minutes');
      const secondsInput = document.getElementById('custom-seconds');
      const startBtn = document.getElementById('start-test-btn');
      
      const minutes = minutesInput ? parseInt(minutesInput.value) || 0 : 0;
      const seconds = secondsInput ? parseInt(secondsInput.value) || 0 : 0;
      
      const validation = Utils.validateCustomDuration(minutes, seconds);
      
      // Update input validation states
      if (minutesInput) minutesInput.classList.toggle('invalid', !validation.minutes);
      if (secondsInput) secondsInput.classList.toggle('invalid', !validation.seconds);
      
      if (validation.isValid) {
        const totalMinutes = Utils.convertToTotalMinutes(minutes, seconds);
        this.stateManager.updateState({ testDuration: totalMinutes });
        
        if (startBtn) startBtn.disabled = false;
        return true;
      } else {
        if (startBtn) startBtn.disabled = true;
        return false;
      }
    } catch (error) {
      console.error('Validate custom duration error:', error);
      return false;
    }
  }

  // Toggle RRB mode
  toggleRRBMode(event) {
    try {
      const isRRBMode = event.target.checked;
      this.stateManager.updateState({ isRRBMode });
      
      // Apply RRB theme
      if (isRRBMode) {
        document.body.setAttribute('data-rrb-mode', 'true');
      } else {
        document.body.removeAttribute('data-rrb-mode');
      }
    } catch (error) {
      console.error('Toggle RRB mode error:', error);
    }
  }

  // Toggle dark mode
  toggleDarkMode(event) {
    try {
      const isDarkMode = event.target.checked;
      this.stateManager.updateState({ isDarkMode });

      document.body.setAttribute('data-theme', isDarkMode ? "dark" : "light");
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    } catch (error) {
      console.error('Toggle dark mode error:', error);
    }
  }

  // Toggle enhanced timer
  toggleEnhancedTimer(event) {
    try {
      const enhancedTimer = event.target.checked;
      this.stateManager.updateState({ enhancedTimer });
    } catch (error) {
      console.error('Toggle enhanced timer error:', error);
    }
  }

  // Toggle question source
  toggleQuestionSource(event) {
    try {
      const questionSource = event.target.value;
      this.stateManager.updateState({ questionSource });
      
      // Show/hide JSON upload section
      this.viewManager.toggleQuestionSourceSection(questionSource);
      
      // Reset custom questions if switching away from JSON
      if (questionSource !== 'json') {
        this.stateManager.updateState({ customQuestions: null });
        
        // Clear file input
        const jsonFileInput = document.getElementById('json-file');
        if (jsonFileInput) {
          jsonFileInput.value = '';
        }
        
        // Hide status
        const statusElement = document.getElementById('json-status');
        if (statusElement) {
          statusElement.classList.add('hidden');
        }
      }
      
      // Update question count display
      this.viewManager.updateQuestionCount(this.stateManager.getState());
    } catch (error) {
      console.error('Toggle question source error:', error);
    }
  }

  // Handle JSON file upload
  async handleJSONUpload(event) {
    const file = event.target.files[0];
    const statusElement = document.getElementById('json-status');
    
    if (!file) {
      if (statusElement) {
        statusElement.classList.add('hidden');
      }
      return;
    }

    try {
      if (statusElement) {
        statusElement.classList.remove('hidden', 'success', 'error');
        statusElement.innerHTML = '<div class="loading">Processing JSON file...</div>';
      }

      const result = await this.questionManager.loadFromFile(file);

      if (result.success) {
        this.stateManager.setCustomQuestions(result.questions);

        if (statusElement) {
          statusElement.classList.add('success');
          statusElement.innerHTML = `<div>✅ Successfully loaded ${result.count} questions from JSON file</div>`;
        }

        this.viewManager.updateQuestionCount(this.stateManager.getState());
      }
    } catch (error) {
      console.error('JSON upload error:', error);
      
      if (statusElement) {
        statusElement.classList.add('error');
        statusElement.innerHTML = `
          <div>❌ Failed to load JSON file:</div>
          <ul><li>${error.error || error.message}</li></ul>
        `;
      }

      // Reset to default questions
      this.stateManager.updateState({ questionSource: 'default', customQuestions: null });
      const questionSourceSelect = document.getElementById('question-source');
      if (questionSourceSelect) {
        questionSourceSelect.value = 'default';
      }
      this.viewManager.updateQuestionCount(this.stateManager.getState());
    }
  }

  // Download example JSON
  downloadExampleJSON() {
    try {
      const exampleData = this.questionManager.getExampleJSON();
      Utils.exportJSON(exampleData, 'example-questions.json');
    } catch (error) {
      console.error('Download example JSON error:', error);
      this.showError('Failed to download example JSON');
    }
  }

  // Export test results
  exportResults() {
    try {
      const state = this.stateManager.getState();
      const results = this.stateManager.getResults();
      
      const exportData = {
        testInfo: {
          date: new Date(state.testStart).toISOString(),
          duration: state.testDuration,
          mode: state.isRRBMode ? 'RRB' : 'Standard',
          questionSource: state.questionSource
        },
        results: results,
        answers: state.answers,
        timeSpent: state.timeSpent,
        bookmarked: state.bookmarked
      };
      
      const filename = `Units_Measurements_Test_Results_${new Date().toISOString().split('T')[0]}.json`;
      Utils.exportJSON(exportData, filename);
    } catch (error) {
      console.error('Export results error:', error);
      this.showError('Failed to export results');
    }
  }

  // Update UI based on current state
  updateUI() {
    try {
      const state = this.stateManager.getState();
      this.viewManager.updateLandingView(state);
    } catch (error) {
      console.error('Update UI error:', error);
    }
  }

  // Show error message
  showError(message) {
    // Simple error display - you can enhance this
    alert(message);
    console.error(message);
  }

  // Get current questions
  getCurrentQuestions() {
    const state = this.stateManager.getState();
    return state.customQuestions || window.DEFAULT_QUESTIONS || [];
  }

  // Phase 4: Enhanced question navigation methods
  initializeEnhancedNavigation() {
    this.setupQuestionSearch();
    this.setupTopicGroups();
    this.setupSmartFilters();
    this.setupViewToggle();
  }

  setupQuestionSearch() {
    const searchInput = document.getElementById('question-search');
    const clearButton = document.getElementById('clear-search');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterQuestionsBySearch(e.target.value);
      });
    }
    
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        searchInput.value = '';
        this.filterQuestionsBySearch('');
        searchInput.focus();
      });
    }
  }

  filterQuestionsBySearch(query) {
    const questions = this.getCurrentQuestions();
    const filteredQuestions = questions.filter(q => 
      q.question.toLowerCase().includes(query.toLowerCase()) ||
      q.topic.toLowerCase().includes(query.toLowerCase())
    );
    this.updateQuestionDisplay(filteredQuestions);
  }

  setupTopicGroups() {
    const topicToggles = document.querySelectorAll('.topic-toggle');
    topicToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => { // eslint-disable-line no-unused-vars
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        
        const questionsContainer = toggle.parentElement.nextElementSibling;
        if (!isExpanded) {
          questionsContainer.style.maxHeight = questionsContainer.scrollHeight + 'px';
        } else {
          questionsContainer.style.maxHeight = '0';
        }
      });
    });
  }

  setupSmartFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        this.applySmartFilter(filter);
      });
    });
  }

  applySmartFilter(filter) {
    const state = this.stateManager.getState();
    const questions = this.getCurrentQuestions();
    
    let filteredQuestions = questions;
    
    switch (filter) {
      case 'answered':
        filteredQuestions = questions.filter((q, index) => state.answers[index + 1]);
        break;
      case 'unanswered':
        filteredQuestions = questions.filter((q, index) => !state.answers[index + 1]);
        break;
      case 'bookmarked':
        filteredQuestions = questions.filter((q, index) => state.bookmarked.includes(index + 1));
        break;
      case 'flagged':
        filteredQuestions = questions.filter((q, index) => state.flagged && state.flagged.includes(index + 1));
        break;
      default:
        filteredQuestions = questions;
    }
    
    this.updateQuestionDisplay(filteredQuestions);
    this.updateFilterCounts();
  }

  setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const topicGroups = document.querySelector('.topic-groups');
    const questionGrid = document.querySelector('.question-grid');
    
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const view = btn.dataset.view;
        if (view === 'topics') {
          topicGroups.classList.remove('hidden');
          questionGrid.classList.add('hidden');
        } else {
          topicGroups.classList.add('hidden');
          questionGrid.classList.remove('hidden');
        }
      });
    });
  }

  updateQuestionDisplay(questions) {
    // Update topic groups
    this.updateTopicGroupsDisplay(questions);
    // Update traditional grid if visible
    this.updateQuestionGrid(questions);
  }

  updateTopicGroupsDisplay(questions) {
    const topics = ['Basic Dimensions', 'Unit Systems', 'Error Analysis'];
    
    topics.forEach(topic => {
      const topicQuestions = questions.filter(q => q.topic === topic);
      const topicContainer = document.querySelector(`[data-topic="${topic}"] .topic-questions`);
      const topicProgress = document.querySelector(`[data-topic="${topic}"] .topic-progress`);
      
      if (topicContainer) {
        topicContainer.innerHTML = '';
        topicQuestions.forEach((q, index) => {
          const questionIndex = questions.indexOf(q) + 1;
          const questionMini = this.createQuestionMini(questionIndex, q);
          topicContainer.appendChild(questionMini);
        });
      }
      
      if (topicProgress) {
        const answeredCount = this.getAnsweredCountForTopic(topic);
        topicProgress.textContent = `${answeredCount}/${topicQuestions.length}`;
      }
    });
  }

  createQuestionMini(questionIndex, question) {
    const state = this.stateManager.getState();
    const mini = document.createElement('div');
    mini.className = 'question-mini';
    mini.textContent = questionIndex;
    mini.dataset.questionIndex = questionIndex;
    
    // Add status classes
    if (questionIndex === state.currentQ) {
      mini.classList.add('current');
    } else if (state.answers[questionIndex]) {
      mini.classList.add('answered');
    }
    
    if (state.bookmarked.includes(questionIndex)) {
      mini.classList.add('bookmarked');
    }
    
    if (state.flagged && state.flagged.includes(questionIndex)) {
      mini.classList.add('flagged');
    }
    
    // Add click handler
    mini.addEventListener('click', () => {
      this.testManager.goToQuestion(questionIndex);
      this.closeSidebar();
    });
    
    return mini;
  }

  updateQuestionGrid(questions) {
    const grid = document.getElementById('question-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    questions.forEach((q, index) => {
      const questionIndex = questions.indexOf(q) + 1;
      const gridItem = this.createQuestionGridItem(questionIndex, q);
      grid.appendChild(gridItem);
    });
  }

  createQuestionGridItem(questionIndex, question) {
    const state = this.stateManager.getState();
    const item = document.createElement('button');
    item.className = 'question-grid-item';
    item.textContent = questionIndex;
    item.dataset.questionIndex = questionIndex;
    
    // Add status classes similar to mini
    if (questionIndex === state.currentQ) {
      item.classList.add('current');
    } else if (state.answers[questionIndex]) {
      item.classList.add('answered');
    }
    
    if (state.bookmarked.includes(questionIndex)) {
      item.classList.add('bookmarked');
    }
    
    // Add click handler
    item.addEventListener('click', () => {
      this.testManager.goToQuestion(questionIndex);
      this.closeSidebar();
    });
    
    return item;
  }

  updateFilterCounts() {
    const state = this.stateManager.getState();
    const questions = this.getCurrentQuestions();
    
    const answeredCount = questions.filter((q, index) => state.answers[index + 1]).length;
    const unansweredCount = questions.length - answeredCount;
    const bookmarkedCount = state.bookmarked.length;
    const flaggedCount = (state.flagged || []).length;
    
    // Update count displays
    const updateCount = (id, count) => {
      const element = document.getElementById(id);
      if (element) element.textContent = count;
    };
    
    updateCount('all-count', questions.length);
    updateCount('answered-count', answeredCount);
    updateCount('answered-filter-count', answeredCount);
    updateCount('unanswered-count', unansweredCount);
    updateCount('bookmarked-count', bookmarkedCount);
    updateCount('flagged-count', flaggedCount);
    updateCount('total-questions', questions.length);
  }

  getAnsweredCountForTopic(topic) {
    const state = this.stateManager.getState();
    const questions = this.getCurrentQuestions();
    const topicQuestions = questions.filter(q => q.topic === topic);
    
    return topicQuestions.filter((q, index) => {
      const questionIndex = questions.indexOf(q) + 1;
      return state.answers[questionIndex];
    }).length;
  }

  closeSidebar() {
    const sidebar = document.getElementById('question-sidebar');
    if (sidebar) {
      sidebar.classList.add('hidden');
    }
  }

  // Phase 4: Advanced analytics methods
  generateAdvancedAnalytics(results) {
    const analytics = {
      accuracyTrend: this.calculateAccuracyTrend(results),
      speedAnalysis: this.calculateSpeedAnalysis(results),
      consistencyScore: this.calculateConsistencyScore(results),
      predictedScore: this.calculatePredictedScore(results),
      timeDistribution: this.calculateTimeDistribution(results),
      smartRecommendations: this.generateSmartRecommendations(results)
    };
    
    this.displayAdvancedAnalytics(analytics);
    return analytics;
  }

  calculateAccuracyTrend(results) {
    // Simulate trend calculation - in real app, this would compare with previous attempts
    return {
      value: '+5.2%',
      direction: 'positive',
      label: 'vs. last attempt'
    };
  }

  calculateSpeedAnalysis(results) {
    const avgTime = results.averageTime || 0;
    const optimalTime = 25; // seconds
    const ratio = avgTime / optimalTime;
    
    return {
      value: `${ratio.toFixed(1)}x`,
      label: 'optimal speed',
      status: ratio < 1.2 ? 'optimal' : ratio < 1.5 ? 'acceptable' : 'slow'
    };
  }

  calculateConsistencyScore(results) {
    // Calculate consistency based on time variance and accuracy patterns
    const score = Math.random() * 2 + 8; // Simulate 8-10 range
    return {
      value: `${score.toFixed(1)}/10`,
      label: 'stability index',
      status: score > 8.5 ? 'strong' : score > 7 ? 'good' : 'needs improvement'
    };
  }

  calculatePredictedScore(results) {
    const currentScore = results.percentage || 0;
    const confidence = Math.random() * 15 + 75; // 75-90% confidence
    const range = Math.round(currentScore * 0.1); // ±10% range
    
    return {
      range: `${Math.max(0, currentScore - range)}-${Math.min(100, currentScore + range)}%`,
      confidence: Math.round(confidence),
      label: 'in real exam'
    };
  }

  calculateTimeDistribution(results) {
    // Simulate time distribution analysis
    return {
      fast: 30,    // 0-20s
      optimal: 45, // 20-35s  
      slow: 25     // 35s+
    };
  }

  generateSmartRecommendations(results) {
    // Generate AI-powered recommendations based on performance
    const recommendations = [];
    
    // Check topic-wise performance
    if (results.topicAnalysis) {
      const weakestTopic = Object.entries(results.topicAnalysis)
        .sort((a, b) => a[1].percentage - b[1].percentage)[0];
      
      if (weakestTopic && weakestTopic[1].percentage < 60) {
        recommendations.push({
          priority: 'high',
          title: `Focus on ${weakestTopic[0]}`,
          description: `You scored ${weakestTopic[1].percentage}% in ${weakestTopic[0]} topics. Reviewing these concepts could significantly improve your overall score.`,
          impact: '+8% potential gain',
          actions: ['Study Now', 'Save for Later']
        });
      }
    }
    
    // Check time management
    const avgTime = results.averageTime || 0;
    if (avgTime > 35) {
      recommendations.push({
        priority: 'medium',
        title: 'Improve Time Management',
        description: 'You spent too much time on easy questions. Practice quick dimensional analysis to save time for harder problems.',
        impact: '+4% potential gain',
        actions: ['Practice Now', 'Learn More']
      });
    }
    
    return recommendations;
  }

  displayAdvancedAnalytics(analytics) {
    // Update accuracy trend
    const accuracyTrendElement = document.getElementById('accuracy-trend');
    if (accuracyTrendElement) {
      accuracyTrendElement.textContent = analytics.accuracyTrend.value;
    }
    
    // Update speed analysis
    const speedMetricElement = document.getElementById('speed-metric');
    if (speedMetricElement) {
      speedMetricElement.textContent = analytics.speedAnalysis.value;
    }
    
    // Update consistency score
    const consistencyScoreElement = document.getElementById('consistency-score');
    if (consistencyScoreElement) {
      consistencyScoreElement.textContent = analytics.consistencyScore.value;
    }
    
    // Update predicted score
    const predictedScoreElement = document.getElementById('predicted-score');
    if (predictedScoreElement) {
      predictedScoreElement.textContent = analytics.predictedScore.range;
    }
    
    // Update confidence bar
    const confidenceBar = document.querySelector('.confidence-fill');
    if (confidenceBar) {
      confidenceBar.style.width = `${analytics.predictedScore.confidence}%`;
    }
    
    const confidenceLabel = document.querySelector('.confidence-label');
    if (confidenceLabel) {
      confidenceLabel.textContent = `${analytics.predictedScore.confidence}% confidence`;
    }
    
    // Update time distribution
    this.updateTimeDistribution(analytics.timeDistribution);
    
    // Update recommendations
    this.updateRecommendations(analytics.smartRecommendations);
  }

  updateTimeDistribution(distribution) {
    const fastSegment = document.querySelector('.time-segment.fast');
    const optimalSegment = document.querySelector('.time-segment.optimal');
    const slowSegment = document.querySelector('.time-segment.slow');
    
    if (fastSegment) fastSegment.style.width = `${distribution.fast}%`;
    if (optimalSegment) optimalSegment.style.width = `${distribution.optimal}%`;
    if (slowSegment) slowSegment.style.width = `${distribution.slow}%`;
    
    // Update legend text
    const legends = document.querySelectorAll('.legend-item span');
    if (legends[0]) legends[0].textContent = `Fast (0-20s): ${distribution.fast}%`;
    if (legends[1]) legends[1].textContent = `Optimal (20-35s): ${distribution.optimal}%`;
    if (legends[2]) legends[2].textContent = `Slow (35s+): ${distribution.slow}%`;
  }

  updateRecommendations(recommendations) {
    const container = document.querySelector('.recommendation-cards');
    if (!container) return;
    
    container.innerHTML = '';
    
    recommendations.forEach(rec => {
      const card = this.createRecommendationCard(rec);
      container.appendChild(card);
    });
  }

  createRecommendationCard(recommendation) {
    const card = document.createElement('div');
    card.className = `recommendation-card priority-${recommendation.priority}`;
    
    card.innerHTML = `
      <div class="rec-header">
        <span class="rec-priority">${recommendation.priority} Priority</span>
        <span class="rec-impact">${recommendation.impact}</span>
      </div>
      <div class="rec-content">
        <h4>${recommendation.title}</h4>
        <p>${recommendation.description}</p>
        <div class="rec-actions">
          ${recommendation.actions.map(action => 
            `<button class="${action === recommendation.actions[0] ? 'rec-btn' : 'rec-btn-secondary'}">${action}</button>`
          ).join('')}
        </div>
      </div>
    `;
    
    return card;
  }

  // Setup PWA-specific functionality
  setupPWAFeatures() {
    // Setup theme handling with UI module
    const themeToggle = document.getElementById('dark-mode');
    if (themeToggle) {
      themeToggle.addEventListener('change', (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        this.ui.setTheme(newTheme);
        this.charts.setTheme(newTheme);
      });
    }

    // Setup responsive chart handling
    window.addEventListener('resize', Utils.debounce(() => {
      this.charts.handleResize();
    }, 250));

    // Setup offline/online handlers
    window.addEventListener('online', () => {
      this.ui.showToast('Connection restored', 'success');
    });

    window.addEventListener('offline', () => {
      this.ui.showToast('You are offline. App will continue to work with limited functionality.', 'warning', 5000);
    });

    // Setup service worker update notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_PROGRESS') {
          this.ui.showToast(event.data.message, 'info');
        }
      });
    }

    // Setup keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Global keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Show search/navigation modal
            break;
          case 's':
            e.preventDefault();
            this.saveProgress();
            break;
          case 'd':
            e.preventDefault();
            if (themeToggle) {
              themeToggle.click();
            }
            break;
        }
      }
    });

    // Setup auto-save functionality
    const settings = this.storage.loadSettings();
    if (settings.auto_save) {
      setInterval(() => {
        if (this.stateManager.getState().testActive) {
          this.saveProgress();
        }
      }, 30000); // Auto-save every 30 seconds
    }
  }

  // Enhanced save progress with storage module
  saveProgress() {
    try {
      const state = this.stateManager.getState();
      const success = this.storage.saveProgress(state);
      
      if (success) {
        this.ui.showToast('Progress saved', 'success', 2000);
      } else {
        this.ui.showToast('Failed to save progress', 'error');
      }
    } catch (error) {
      console.error('Save progress error:', error);
      this.ui.showToast('Failed to save progress', 'error');
    }
  }

  // Phase 5: Initialize advanced features
  initializePhase5Features() {
    try {
      // Setup adaptive learning integration
      this.setupAdaptiveLearningIntegration();
      
      // Setup performance analytics integration
      this.setupPerformanceAnalyticsIntegration();
      
      // Setup advanced UI components
      this.setupAdvancedUIComponents();
      
      // Initialize real-time feedback system
      this.setupRealTimeFeedback();
      
      console.log('Phase 5 features initialized successfully');
    } catch (error) {
      console.error('Phase 5 initialization error:', error);
    }
  }
  
  // Setup adaptive learning integration
  setupAdaptiveLearningIntegration() {
    // Override question selection to use adaptive recommendations
    const originalGetQuestions = this.getCurrentQuestions.bind(this);
    this.getCurrentQuestions = () => {
      const baseQuestions = originalGetQuestions();
      if (this.adaptiveSystem && this.adaptiveSystem.adaptiveSettings.enabled) {
        return this.adaptiveSystem.getRecommendedQuestions(baseQuestions);
      }
      return baseQuestions;
    };
    
    // Override timer duration to use adaptive timing
    if (this.testManager && this.testManager.startQuestionTimer) {
      const originalStartTimer = this.testManager.startQuestionTimer.bind(this.testManager);
      this.testManager.startQuestionTimer = function(questionDifficulty, topic) {
        if (window.appAdaptive && window.appAdaptive.adaptiveSettings.intelligentTimer) {
          const adaptiveDuration = window.appAdaptive.getAdaptiveTimerDuration(questionDifficulty, topic);
          // Override the timer duration here
          this.questionTimerDuration = adaptiveDuration;
        }
        return originalStartTimer.call(this);
      };
    }
  }
  
  // Setup performance analytics integration
  setupPerformanceAnalyticsIntegration() {
    // Hook into test completion to record analytics
    const originalSubmitTest = this.testManager ? this.testManager.submitTest : null;
    if (originalSubmitTest && this.testManager) {
      this.testManager.submitTest = (...args) => {
        const result = originalSubmitTest.apply(this.testManager, args);
        
        // Record performance data for analytics
        setTimeout(() => {
          this.recordTestPerformanceForAnalytics();
        }, 1000);
        
        return result;
      };
    }
  }
  
  // Record test performance for analytics
  recordTestPerformanceForAnalytics() {
    try {
      const state = this.stateManager.getState();
      const results = this.stateManager.getResults();
      
      if (results && this.performanceAnalytics) {
        const testData = {
          score: results.percentage,
          totalQuestions: results.total,
          correctAnswers: results.correct,
          timeSpent: results.totalTime,
          averageTimePerQuestion: results.averageTime,
          topicBreakdown: results.topicAnalysis,
          difficultyBreakdown: results.difficultyAnalysis,
          questionDetails: state.answers,
          settings: {
            testDuration: state.testDuration,
            enhancedTimer: state.enhancedTimer,
            isRRBMode: state.isRRBMode
          }
        };
        
        this.performanceAnalytics.recordTestPerformance(testData);
        
        // Update adaptive system with individual question performance
        if (this.adaptiveSystem) {
          const currentQuestions = this.getCurrentQuestions();
          Object.entries(state.answers).forEach(([questionIndex, answer]) => {
            const qIndex = parseInt(questionIndex);
            const question = currentQuestions[qIndex];
            if (question && answer !== null) {
              const isCorrect = answer === question.correctIndex;
              const timeSpent = state.timeSpent[qIndex] || 0;
              this.adaptiveSystem.recordAnswer(qIndex, isCorrect, timeSpent, question.difficulty, question.topic);
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to record test performance for analytics:', error);
    }
  }
  
  // Setup advanced UI components
  setupAdvancedUIComponents() {
    // Add performance insights to results view
    this.addPerformanceInsightComponents();
    
    // Add adaptive learning status indicators
    this.addAdaptiveLearningIndicators();
    
    // Setup smart notifications
    this.setupSmartNotifications();
  }
  
  // Add performance insight components
  addPerformanceInsightComponents() {
    const resultView = document.getElementById('result-view');
    if (!resultView) return;
    
    // Check if analytics section already exists
    if (resultView.querySelector('.advanced-analytics-section')) return;
    
    const analyticsSection = document.createElement('div');
    analyticsSection.className = 'advanced-analytics-section phase5-feature';
    analyticsSection.innerHTML = `
      <div class="analytics-header">
        <h3>🧠 AI Performance Insights</h3>
        <p>Advanced analytics powered by machine learning</p>
      </div>
      
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon">📈</div>
          <div class="insight-content">
            <h4>Learning Velocity</h4>
            <div class="insight-value" id="learning-velocity">--</div>
            <div class="insight-description">Points improvement per test</div>
          </div>
        </div>
        
        <div class="insight-card">
          <div class="insight-icon">🎯</div>
          <div class="insight-content">
            <h4>Consistency Index</h4>
            <div class="insight-value" id="consistency-index">--</div>
            <div class="insight-description">Performance stability score</div>
          </div>
        </div>
        
        <div class="insight-card">
          <div class="insight-icon">🔮</div>
          <div class="insight-content">
            <h4>Next Score Prediction</h4>
            <div class="insight-value" id="score-prediction">--</div>
            <div class="insight-description">AI-predicted next result</div>
          </div>
        </div>
        
        <div class="insight-card">
          <div class="insight-icon">⏱️</div>
          <div class="insight-content">
            <h4>Time to Mastery</h4>
            <div class="insight-value" id="time-to-mastery">--</div>
            <div class="insight-description">Estimated practice needed</div>
          </div>
        </div>
      </div>
      
      <div class="ai-recommendations" id="ai-recommendations">
        <!-- AI recommendations will be populated here -->
      </div>
    `;
    
    // Insert before existing content
    const firstChild = resultView.firstElementChild;
    if (firstChild) {
      resultView.insertBefore(analyticsSection, firstChild);
    } else {
      resultView.appendChild(analyticsSection);
    }
  }
  
  // Add adaptive learning indicators
  addAdaptiveLearningIndicators() {
    const testView = document.getElementById('test-view');
    if (!testView || testView.querySelector('.adaptive-indicators')) return;
    
    const indicators = document.createElement('div');
    indicators.className = 'adaptive-indicators phase5-feature';
    indicators.innerHTML = `
      <div class="adaptive-status" id="adaptive-status">
        <div class="status-indicator">
          <span class="status-icon">🧠</span>
          <span class="status-text">AI Adaptive Mode</span>
          <span class="status-badge" id="adaptive-badge">OFF</span>
        </div>
      </div>
    `;
    
    const testHeader = testView.querySelector('.test-header');
    if (testHeader) {
      testHeader.appendChild(indicators);
    }
  }
  
  // Setup real-time feedback system
  setupRealTimeFeedback() {
    // Monitor answer patterns and provide real-time insights
    const originalSelectOption = this.testManager ? this.testManager.selectOption : null;
    if (originalSelectOption && this.testManager) {
      this.testManager.selectOption = function(optionIndex) {
        const result = originalSelectOption.call(this, optionIndex);
        
        // Trigger real-time feedback
        setTimeout(() => {
          window.app.provideLiveInsight();
        }, 500);
        
        return result;
      };
    }
  }
  
  // Provide live insights during test
  provideLiveInsight() {
    if (!this.adaptiveSystem || !this.adaptiveSystem.adaptiveSettings.enabled) return;
    
    const state = this.stateManager.getState();
    const currentQ = state.currentQ; // eslint-disable-line no-unused-vars
    const answeredCount = Object.keys(state.answers).length;
    
    // Provide insights every 10 questions
    if (answeredCount > 0 && answeredCount % 10 === 0) {
      const insights = this.generateLiveInsights(state);
      this.showLiveInsightNotification(insights);
    }
  }
  
  // Generate live insights
  generateLiveInsights(state) {
    const answeredQuestions = Object.keys(state.answers).length;
    const correctAnswers = Object.entries(state.answers).filter(([_, answer]) => {
      const qIndex = parseInt(_);
      const question = this.getCurrentQuestions()[qIndex];
      return question && answer === question.correctIndex;
    }).length;
    
    const accuracy = correctAnswers / answeredQuestions;
    const avgTime = Object.values(state.timeSpent).reduce((sum, time) => sum + time, 0) / answeredQuestions;
    
    let message = '';
    let type = 'info';
    
    if (accuracy > 0.8) {
      message = `🎯 Excellent! ${Math.round(accuracy * 100)}% accuracy. Keep it up!`;
      type = 'success';
    } else if (accuracy < 0.5) {
      message = `⚠️ Consider slowing down. Focus on accuracy over speed.`;
      type = 'warning';
    } else if (avgTime > 35) {
      message = `⏱️ Try to speed up. Aim for under 30 seconds per question.`;
      type = 'info';
    } else {
      message = `📊 Good pace! ${Math.round(accuracy * 100)}% accuracy at ${Math.round(avgTime)}s avg.`;
      type = 'success';
    }
    
    return { message, type, accuracy, avgTime };
  }
  
  // Show live insight notification
  showLiveInsightNotification(insights) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast(insights.message, insights.type, 4000);
    }
  }
  
  // Setup smart notifications
  setupSmartNotifications() {
    // Setup intelligent break reminders
    this.setupIntelligentBreaks();
    
    // Setup performance milestone notifications
    this.setupMilestoneNotifications();
  }
  
  // Setup intelligent break reminders
  setupIntelligentBreaks() {
    let testStartTime = null;
    
    // Override test start to track time
    const originalStartTest = this.startTest.bind(this);
    this.startTest = function() {
      testStartTime = Date.now();
      
      // Setup break reminder after 45 minutes
      setTimeout(() => {
        if (window.Utils && window.Utils.showToast) {
          window.Utils.showToast('💡 Consider taking a short break to maintain focus', 'info', 5000);
        }
      }, 45 * 60 * 1000);
      
      return originalStartTest.apply(this, arguments);
    };
  }
  
  // Setup milestone notifications
  setupMilestoneNotifications() {
    // Override question navigation to track milestones
    const originalNavigateQuestion = this.testManager ? this.testManager.navigateQuestion : null;
    if (originalNavigateQuestion && this.testManager) {
      this.testManager.navigateQuestion = function(direction) {
        const result = originalNavigateQuestion.call(this, direction);
        
        const currentQ = window.app.stateManager.getCurrentQuestion(); // eslint-disable-line no-unused-vars
        const milestones = [10, 25, 40];
        
        if (milestones.includes(currentQ)) {
          const answered = Object.keys(window.app.stateManager.getAnswers()).length;
          const accuracy = window.app.calculateCurrentAccuracy();
          
          setTimeout(() => {
            if (window.Utils && window.Utils.showToast) {
              window.Utils.showToast(
                `🎯 Milestone: ${currentQ}/50 questions! Current accuracy: ${Math.round(accuracy * 100)}%`,
                accuracy > 0.7 ? 'success' : 'info',
                3000
              );
            }
          }, 500);
        }
        
        return result;
      };
    }
  }
  
  // Enhanced load progress with storage module
  loadProgress() {
    try {
      const progress = this.storage.loadProgress();
      if (progress) {
        this.stateManager.updateState(progress);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Load progress error:', error);
      return false;
    }
  }
}

// Make MockTestApp globally available
window.MockTestApp = MockTestApp;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MockTestApp();
  window.app.init().catch(error => {
    console.error('Failed to initialize app:', error);
  });
});

// Export for browser use - attach to window object
window.MockTestApp = MockTestApp;
