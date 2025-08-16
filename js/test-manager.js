// Test Management Module
// Handles test execution, question display, navigation, and timing

/* global CustomTimer */

class TestManager {
  constructor(stateManager, viewManager, questionManager) {
    this.stateManager = stateManager;
    this.viewManager = viewManager;
    this.questionManager = questionManager;
    
    // Timer instances
    this.mainTimer = null;
    this.questionTimer = null;
    this.questionStartTime = null;
    this.autoSaveInterval = null;
    this.customMainTimer = null;
    this.customQuestionTimer = null;
    
    // Timer DOM elements cache
    this.timerElements = {};
  }

  // Initialize timer elements and cache them
  initializeTimerElements() {
    try {
      this.timerElements = {
        mainTimer: document.getElementById('main-timer'),
        mainTimerProgress: document.getElementById('main-timer-progress'),
        questionTimer: document.getElementById('question-timer'),
        questionTimerProgress: document.getElementById('question-timer-progress')
      };
      
      // Create timer elements if they don't exist
      this.ensureTimerElementsExist();
    } catch (error) {
      console.error('Initialize timer elements error:', error);
    }
  }

  // Ensure timer elements exist in DOM
  ensureTimerElementsExist() {
    const testView = document.getElementById('test-view');
    if (!testView) return;

    // Create main timer if it doesn't exist
    if (!this.timerElements.mainTimer) {
      const timerContainer = testView.querySelector('.timer-section') || testView.querySelector('.test-header');
      if (timerContainer) {
        const mainTimerDiv = document.createElement('div');
        mainTimerDiv.className = 'main-timer-container';
        mainTimerDiv.innerHTML = `
          <div class="timer-display">
            <span class="timer-label">Time Remaining:</span>
            <span id="main-timer" class="timer-value">00:00</span>
          </div>
          <div id="main-timer-progress" class="timer-progress hidden">
            <div class="progress-bar"></div>
          </div>
        `;
        timerContainer.appendChild(mainTimerDiv);
        this.timerElements.mainTimer = document.getElementById('main-timer');
        this.timerElements.mainTimerProgress = document.getElementById('main-timer-progress');
      }
    }

    // Create question timer if it doesn't exist
    if (!this.timerElements.questionTimer) {
      const questionContainer = testView.querySelector('.question-container') || testView.querySelector('.question-section');
      if (questionContainer) {
        const questionTimerDiv = document.createElement('div');
        questionTimerDiv.className = 'question-timer-container';
        questionTimerDiv.innerHTML = `
          <div class="timer-display">
            <span class="timer-label">Question Time:</span>
            <span id="question-timer" class="timer-value">00:00</span>
          </div>
          <div id="question-timer-progress" class="timer-progress hidden">
            <div class="progress-bar"></div>
          </div>
        `;
        questionContainer.insertBefore(questionTimerDiv, questionContainer.firstChild);
        this.timerElements.questionTimer = document.getElementById('question-timer');
        this.timerElements.questionTimerProgress = document.getElementById('question-timer-progress');
      }
    }
  }

  // Start test timer
  startMainTimer() {
    try {
      this.initializeTimerElements();
      const state = this.stateManager.getState();
      if (state.enhancedTimer) {
        this.startEnhancedMainTimer();
      } else {
        this.startBasicMainTimer();
      }
    } catch (error) {
      console.error('Start main timer error:', error);
    }
  }

  // Start enhanced main timer with progress and alerts
  startEnhancedMainTimer() {
    if (this.customMainTimer) {
      this.customMainTimer.stop();
    }
    
    const state = this.stateManager.getState();
    const timerElement = this.timerElements.mainTimer;
    const progressElement = this.timerElements.mainTimerProgress;
    
    if (!timerElement) {
      console.warn('Main timer element not found, falling back to basic timer');
      this.startBasicMainTimer();
      return;
    }
    
    if (progressElement) {
      progressElement.classList.remove('hidden');
    }
    
    // Use a simple enhanced timer if CustomTimer is not available
    if (typeof CustomTimer !== 'undefined') {
      this.customMainTimer = new CustomTimer({
        duration: state.testDuration,
        element: timerElement,
        progressElement: progressElement,
        audioAlert: true,
        visualAlert: true,
        warningThresholds: [10, 5, 2],
        onComplete: () => this.submitTest(),
        onWarning: (threshold) => {
          console.log(`Timer warning: ${threshold} minutes remaining`);
        }
      });
      
      this.customMainTimer.start();
    } else {
      // Fallback to basic timer with enhanced features
      this.startEnhancedBasicMainTimer();
    }
  }

  // Enhanced basic main timer (fallback)
  startEnhancedBasicMainTimer() {
    if (this.mainTimer) clearInterval(this.mainTimer);
    
    const state = this.stateManager.getState();
    const timerElement = this.timerElements.mainTimer;
    const progressElement = this.timerElements.mainTimerProgress;
    const totalDuration = state.testDuration * 60 * 1000;
    
    if (progressElement) {
      progressElement.classList.remove('hidden');
    }
    
    this.mainTimer = setInterval(() => {
      const elapsed = Date.now() - state.testStart;
      const remaining = totalDuration - elapsed;
      
      if (remaining <= 0) {
        this.submitTest();
        return;
      }
      
      const timeString = this.formatTime(remaining);
      if (timerElement) {
        timerElement.textContent = timeString;
        
        // Add warning classes
        timerElement.classList.remove('warning', 'danger');
        if (remaining < 5 * 60 * 1000) {
          timerElement.classList.add('danger');
        } else if (remaining < 10 * 60 * 1000) {
          timerElement.classList.add('warning');
        }
      }
      
      // Update progress bar
      if (progressElement) {
        const progressBar = progressElement.querySelector('.progress-bar');
        if (progressBar) {
          const percentage = ((totalDuration - remaining) / totalDuration) * 100;
          progressBar.style.width = `${percentage}%`;
        }
      }
    }, 1000);
  }

  // Start basic main timer
  startBasicMainTimer() {
    if (this.mainTimer) clearInterval(this.mainTimer);
    
    const state = this.stateManager.getState();
    const timerElement = this.timerElements.mainTimer;
    
    if (!timerElement) {
      console.warn('Main timer element not found');
      return;
    }
    
    this.mainTimer = setInterval(() => {
      const elapsed = Date.now() - state.testStart;
      const remaining = (state.testDuration * 60 * 1000) - elapsed;
      
      if (remaining <= 0) {
        this.submitTest();
        return;
      }
      
      const timeString = this.formatTime(remaining);
      timerElement.textContent = timeString;
      
      // Add warning classes
      timerElement.classList.remove('warning', 'danger');
      if (remaining < 5 * 60 * 1000) {
        timerElement.classList.add('danger');
      } else if (remaining < 10 * 60 * 1000) {
        timerElement.classList.add('warning');
      }
    }, 1000);
  }

  // Start question timer
  startQuestionTimer() {
    try {
      this.initializeTimerElements();
      const state = this.stateManager.getState();
      if (state.enhancedTimer) {
        this.startEnhancedQuestionTimer();
      } else {
        this.startBasicQuestionTimer();
      }
    } catch (error) {
      console.error('Start question timer error:', error);
    }
  }

  // Start enhanced question timer
  startEnhancedQuestionTimer() {
    if (this.customQuestionTimer) {
      this.customQuestionTimer.stop();
    }
    
    const timerElement = this.timerElements.questionTimer;
    const progressElement = this.timerElements.questionTimerProgress;
    
    if (!timerElement) {
      console.warn('Question timer element not found, falling back to basic timer');
      this.startBasicQuestionTimer();
      return;
    }
    
    if (progressElement) {
      progressElement.classList.remove('hidden');
    }
    
    // Use 40 seconds for question timer (standard for competitive exams)
    const timeLimit = 40; // 40 seconds
    
    this.questionStartTime = Date.now();
    
    // Use CustomTimer if available, otherwise fallback
    if (typeof CustomTimer !== 'undefined') {
      this.customQuestionTimer = CustomTimer.createQuestionTimer({
        element: timerElement,
        progressElement: progressElement,
        audioAlert: false,
        visualAlert: true,
        onTick: (remaining) => {
          const elapsed = Math.floor((Date.now() - this.questionStartTime) / 1000);
          this.stateManager.updateTimeSpent(this.stateManager.getCurrentQuestion(), elapsed);
          
          // Update circular progress
          this.updateCircularProgress(remaining);
        },
        onComplete: () => {
          // Auto move to next question when time is up
          console.log('Question time up, moving to next question');
          this.nextQuestion();
        }
      });
      
      this.customQuestionTimer.start();
    } else {
      this.startEnhancedBasicQuestionTimer(timeLimit);
    }
  }

  // Enhanced basic question timer (fallback)
  startEnhancedBasicQuestionTimer(timeLimit) {
    if (this.questionTimer) clearInterval(this.questionTimer);
    
    const timerElement = this.timerElements.questionTimer;
    const progressElement = this.timerElements.questionTimerProgress;
    const totalDuration = timeLimit * 1000; // Convert to milliseconds
    
    this.questionStartTime = Date.now();
    
    this.questionTimer = setInterval(() => {
      const elapsed = Date.now() - this.questionStartTime;
      const remaining = totalDuration - elapsed;
      
      if (timerElement) {
        if (remaining > 0) {
          const timeString = this.formatTime(remaining);
          timerElement.textContent = timeString;
          
          // Update warning classes
          timerElement.classList.remove('warning', 'danger', 'timer-warning', 'timer-critical', 'timer-normal');
          if (remaining < 5000) { // Last 5 seconds
            timerElement.classList.add('danger', 'timer-critical');
          } else if (remaining < 10000) { // Last 10 seconds
            timerElement.classList.add('warning', 'timer-warning');
          } else {
            timerElement.classList.add('timer-normal');
          }
        } else {
          timerElement.textContent = 'Time Up!';
          timerElement.classList.add('danger', 'timer-critical');
          
          // Auto move to next question
          this.nextQuestion();
          return;
        }
      }
      
      // Update progress bar
      if (progressElement && remaining > 0) {
        const progressBar = progressElement.querySelector('.progress-bar');
        if (progressBar) {
          const percentage = (remaining / totalDuration) * 100;
          progressBar.style.width = `${Math.max(0, percentage)}%`;
          
          // Update progress bar color
          progressBar.classList.remove('progress-warning', 'progress-critical', 'progress-normal');
          if (percentage <= 12.5) { // Last 5 seconds of 40
            progressBar.classList.add('progress-critical');
          } else if (percentage <= 25) { // Last 10 seconds of 40
            progressBar.classList.add('progress-warning');
          } else {
            progressBar.classList.add('progress-normal');
          }
        }
      }
      
      // Update circular progress
      this.updateCircularProgress(remaining);
      
      // Update time spent
      const elapsedSeconds = Math.floor(elapsed / 1000);
      this.stateManager.updateTimeSpent(this.stateManager.getCurrentQuestion(), elapsedSeconds);
    }, 1000);
  }
  
  // Update circular progress indicator
  updateCircularProgress(remaining) {
    try {
      const circularProgress = document.getElementById('question-timer-circle');
      const circularText = document.querySelector('.circular-timer-text');
      
      if (circularProgress) {
        const totalTime = 40 * 1000; // 40 seconds in milliseconds
        const percentage = Math.max(0, (remaining / totalTime));
        const circumference = 2 * Math.PI * 45; // radius = 45
        const dashOffset = circumference * (1 - percentage);
        
        circularProgress.style.strokeDashoffset = dashOffset;
        
        // Update color based on remaining time
        if (remaining <= 5000) { // Last 5 seconds
          circularProgress.style.stroke = '#dc3545'; // Red
        } else if (remaining <= 10000) { // Last 10 seconds
          circularProgress.style.stroke = '#ffc107'; // Yellow
        } else {
          circularProgress.style.stroke = '#1FB8CD'; // Teal
        }
      }
      
      if (circularText) {
        const secondsRemaining = Math.max(0, Math.ceil(remaining / 1000));
        circularText.textContent = secondsRemaining;
      }
    } catch (error) {
      console.error('Update circular progress error:', error);
    }
  }

  // Start basic question timer
  startBasicQuestionTimer() {
    this.questionStartTime = Date.now();
    
    if (this.questionTimer) clearInterval(this.questionTimer);
    
    const timerElement = this.timerElements.questionTimer;
    
    if (!timerElement) {
      console.warn('Question timer element not found');
      return;
    }
    
    // Use 40 seconds for question timer
    const totalDuration = 40 * 1000; // 40 seconds
    
    this.questionTimer = setInterval(() => {
      const elapsed = Date.now() - this.questionStartTime;
      const remaining = totalDuration - elapsed;
      
      if (remaining > 0) {
        const timeString = this.formatTime(remaining);
        timerElement.textContent = timeString;
        
        // Update warning classes
        timerElement.classList.remove('warning', 'danger', 'timer-warning', 'timer-critical', 'timer-normal');
        if (remaining < 5000) { // Last 5 seconds
          timerElement.classList.add('danger', 'timer-critical');
        } else if (remaining < 10000) { // Last 10 seconds
          timerElement.classList.add('warning', 'timer-warning');
        } else {
          timerElement.classList.add('timer-normal');
        }
      } else {
        timerElement.textContent = 'Time Up!';
        timerElement.classList.add('danger', 'timer-critical');
        
        // Auto move to next question
        this.nextQuestion();
        return;
      }
      
      // Update circular progress
      this.updateCircularProgress(remaining);
      
      // Update time spent
      const elapsedSeconds = Math.floor(elapsed / 1000);
      this.stateManager.updateTimeSpent(this.stateManager.getCurrentQuestion(), elapsedSeconds);
    }, 1000);
  }

  // Stop question timer
  stopQuestionTimer() {
    try {
      const state = this.stateManager.getState();
      
      if (state.enhancedTimer && this.customQuestionTimer) {
        this.customQuestionTimer.stop();
        this.customQuestionTimer = null;
        if (this.timerElements.questionTimerProgress) {
          this.timerElements.questionTimerProgress.classList.add('hidden');
        }
      } else {
        if (this.questionTimer) {
          clearInterval(this.questionTimer);
          this.questionTimer = null;
        }
        if (this.timerElements.questionTimerProgress) {
          this.timerElements.questionTimerProgress.classList.add('hidden');
        }
      }
      
      if (this.questionStartTime) {
        const elapsed = Math.floor((Date.now() - this.questionStartTime) / 1000);
        const currentTimeSpent = this.stateManager.getTimeSpent()[this.stateManager.getCurrentQuestion()] || 0;
        this.stateManager.updateTimeSpent(this.stateManager.getCurrentQuestion(), currentTimeSpent + elapsed);
        this.questionStartTime = null;
      }
    } catch (error) {
      console.error('Stop question timer error:', error);
    }
  }

  // Format time helper function
  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Start auto-save
  startAutoSave() {
    try {
      if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
      
      this.autoSaveInterval = setInterval(() => {
        this.stateManager.saveState();
      }, 5000); // Save every 5 seconds
    } catch (error) {
      console.error('Start auto save error:', error);
    }
  }

  // Update question display (called when view is activated)
  updateQuestionDisplay() {
    try {
      this.initializeTimerElements();
      this.displayQuestion();
    } catch (error) {
      console.error('Update question display error:', error);
    }
  }

  // Initialize review functionality
  initializeReview() {
    try {
      // Set initial review question to 0
      this.stateManager.updateState({ reviewCurrentQ: 0 });
      
      // Initialize review display if we're using the single-question review view
      if (window.app && window.app.updateReviewDisplay) {
        window.app.updateReviewDisplay(0);
      } else {
        // Fallback: populate full review answers
        this.populateReviewAnswers();
      }
    } catch (error) {
      console.error('Initialize review error:', error);
    }
  }

  // Display current question
  displayQuestion() {
    try {
      const currentQuestions = this.getCurrentQuestions();
      const currentQ = this.stateManager.getCurrentQuestion();
      const question = currentQuestions[currentQ];
      
      if (!question) {
        console.error('Question not found:', currentQ);
        return;
      }
      
      // Stop previous question timer
      this.stopQuestionTimer();
      
      // Update question info
      this.viewManager.updateElement('current-q-num', currentQ + 1);
      this.viewManager.updateElement('question-text', question.question);
      this.viewManager.updateElement('difficulty-badge', question.difficulty);
      this.viewManager.updateElement('topic-badge', question.topic);
      
      // Update difficulty badge styling
      const difficultyBadge = document.getElementById('difficulty-badge');
      if (difficultyBadge) {
        difficultyBadge.className = `status status--${
          question.difficulty.toLowerCase() === 'easy' ? 'success' : 
          question.difficulty.toLowerCase() === 'medium' ? 'warning' : 'error'
        }`;
      }
      
      // Update bookmark button
      const isBookmarked = this.stateManager.getBookmarked()[currentQ];
      this.viewManager.toggleElementClass('bookmark-btn', 'bookmarked', isBookmarked);
      
      // Display options
      this.displayOptions(question);
      
      // Update navigation buttons
      this.updateNavigationButtons(currentQuestions.length);
      
      // Update question number display
      const questionNumberSpan = document.querySelector('.question-number');
      if (questionNumberSpan) {
        questionNumberSpan.innerHTML = `Question <span id="current-q-num">${currentQ + 1}</span> of ${currentQuestions.length}`;
      }
      
      // Start question timer
      this.startQuestionTimer();
    } catch (error) {
      console.error('Display question error:', error);
    }
  }

  // Display question options
  displayOptions(question) {
    const optionsContainer = document.getElementById('options-container');
    if (!optionsContainer) return;
    
    const currentAnswer = this.stateManager.getAnswers()[this.stateManager.getCurrentQuestion()];
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option-item';
      if (currentAnswer === index) {
        optionElement.classList.add('selected');
      }
      
      optionElement.innerHTML = `
        <input type="radio" class="option-radio" name="answer" value="${index}" ${currentAnswer === index ? 'checked' : ''}>
        <span class="option-text">${option}</span>
      `;
      
      optionElement.addEventListener('click', () => this.selectOption(index));
      optionsContainer.appendChild(optionElement);
    });
  }

  // Update navigation buttons
  updateNavigationButtons(totalQuestions) {
    const currentQ = this.stateManager.getCurrentQuestion();
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) prevBtn.disabled = currentQ === 0;
    if (nextBtn) nextBtn.textContent = currentQ === totalQuestions - 1 ? 'Finish →' : 'Next →';
  }

  // Select option
  selectOption(optionIndex) {
    try {
      const currentQ = this.stateManager.getCurrentQuestion();
      this.stateManager.setAnswer(currentQ, optionIndex);
      
      // Update visual selection
      document.querySelectorAll('.option-item').forEach((item, index) => {
        item.classList.toggle('selected', index === optionIndex);
        const radio = item.querySelector('input[type="radio"]');
        if (radio) radio.checked = index === optionIndex;
      });
    } catch (error) {
      console.error('Select option error:', error);
    }
  }

  // Navigate between questions
  navigateQuestion(direction) {
    try {
      const currentQuestions = this.getCurrentQuestions();
      const currentQ = this.stateManager.getCurrentQuestion();
      const newQ = currentQ + direction;
      
      if (newQ >= 0 && newQ < currentQuestions.length) {
        this.stateManager.setCurrentQuestion(newQ);
        this.displayQuestion();
      } else if (newQ >= currentQuestions.length) {
        this.submitTest();
      }
    } catch (error) {
      console.error('Navigate question error:', error);
    }
  }

  // Next question method (for event listeners)
  nextQuestion() {
    this.navigateQuestion(1);
  }

  // Previous question method (for event listeners)
  previousQuestion() {
    this.navigateQuestion(-1);
  }

  // Toggle bookmark
  toggleBookmark() {
    try {
      const currentQ = this.stateManager.getCurrentQuestion();
      this.stateManager.toggleBookmark(currentQ);
      
      const isBookmarked = this.stateManager.getBookmarked()[currentQ];
      const bookmarkBtn = document.getElementById('bookmark-btn');
      
      // Update bookmark button visual state
      if (bookmarkBtn) {
        bookmarkBtn.classList.toggle('bookmarked', isBookmarked);
        
        // Add temporary visual feedback
        bookmarkBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
          bookmarkBtn.style.transform = '';
        }, 150);
      }
      
      // Also update via viewManager for consistency
      this.viewManager.toggleElementClass('bookmark-btn', 'bookmarked', isBookmarked);
    } catch (error) {
      console.error('Toggle bookmark error:', error);
    }
  }

  // Clear answer
  clearAnswer() {
    try {
      const currentQ = this.stateManager.getCurrentQuestion();
      this.stateManager.clearAnswer(currentQ);
      
      // Update visual selection
      document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
        const radio = item.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
      });
    } catch (error) {
      console.error('Clear answer error:', error);
    }
  }

  // Show review panel
  showReviewPanel() {
    try {
      this.updateReviewGrid();
      this.viewManager.showModal('review-panel');
    } catch (error) {
      console.error('Show review panel error:', error);
    }
  }

  // Hide review panel
  hideReviewPanel() {
    try {
      this.viewManager.hideModal('review-panel');
    } catch (error) {
      console.error('Hide review panel error:', error);
    }
  }

  // Update review grid
  updateReviewGrid() {
    try {
      const reviewGrid = document.getElementById('review-grid');
      if (!reviewGrid) return;
      
      const currentQuestions = this.getCurrentQuestions();
      const state = this.stateManager.getState();
      
      reviewGrid.innerHTML = '';
      
      for (let i = 0; i < currentQuestions.length; i++) {
        const item = document.createElement('div');
        item.className = 'review-item';
        item.textContent = i + 1;
        
        // Add status classes
        if (i === state.currentQ) {
          item.classList.add('current');
        }
        
        if (state.answers[i] !== null) {
          item.classList.add('answered');
        } else {
          item.classList.add('unanswered');
        }
        
        if (state.bookmarked[i]) {
          item.classList.add('bookmarked');
          // Add bookmark icon or indicator
          const bookmarkIcon = document.createElement('span');
          bookmarkIcon.className = 'bookmark-indicator';
          bookmarkIcon.innerHTML = '★';
          item.appendChild(bookmarkIcon);
        }
        
        // Add tooltip showing status
        const status = [];
        if (state.answers[i] !== null) status.push('Answered');
        if (state.bookmarked[i]) status.push('Bookmarked');
        if (status.length === 0) status.push('Not answered');
        item.title = `Question ${i + 1}: ${status.join(', ')}`;
        
        item.addEventListener('click', () => {
          this.stateManager.setCurrentQuestion(i);
          this.hideReviewPanel();
          this.displayQuestion();
        });
        
        reviewGrid.appendChild(item);
      }
    } catch (error) {
      console.error('Update review grid error:', error);
    }
  }

  // Submit test
  submitTest() {
    if (!confirm('Are you sure you want to submit your test? You cannot change your answers after submission.')) {
      return;
    }
    
    try {
      this.stateManager.setTestEnd();
      this.stopQuestionTimer();
      
      // Stop timers
      const state = this.stateManager.getState();
      if (state.enhancedTimer) {
        if (this.customMainTimer) {
          this.customMainTimer.stop();
          this.customMainTimer = null;
        }
        if (this.customQuestionTimer) {
          this.customQuestionTimer.stop();
          this.customQuestionTimer = null;
        }
        // Hide progress bars
        if (this.timerElements.mainTimerProgress) {
          this.timerElements.mainTimerProgress.classList.add('hidden');
        }
        if (this.timerElements.questionTimerProgress) {
          this.timerElements.questionTimerProgress.classList.add('hidden');
        }
      } else {
        if (this.mainTimer) clearInterval(this.mainTimer);
      }
      
      if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
      
      this.calculateResults();
      this.displayResults();
      this.viewManager.showView('result');
    } catch (error) {
      console.error('Submit test error:', error);
      alert('Failed to submit test. Please try again.');
    }
  }

  // Calculate test results
  calculateResults() {
    try {
      const currentQuestions = this.getCurrentQuestions();
      const state = this.stateManager.getState();
      const totalQuestions = currentQuestions.length;
      
      const results = {
        score: 0,
        totalQuestions: totalQuestions,
        totalTime: state.testEnd - state.testStart,
        questionResults: [],
        topicStats: {},
        difficultyStats: {}
      };
      
      // Calculate score and detailed results
      for (let i = 0; i < totalQuestions; i++) {
        const question = currentQuestions[i];
        const userAnswer = state.answers[i];
        const isCorrect = userAnswer !== null && userAnswer === question.correctIndex;
        const timeSpent = state.timeSpent[i] || 0;
        
        if (isCorrect) results.score++;
        
        results.questionResults.push({
          questionId: i + 1,
          question: question.question,
          topic: question.topic,
          difficulty: question.difficulty,
          userAnswer: userAnswer,
          correctAnswer: question.correctIndex,
          isCorrect: isCorrect,
          timeSpent: timeSpent,
          status: userAnswer === null ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect')
        });
        
        // Topic stats
        if (!results.topicStats[question.topic]) {
          results.topicStats[question.topic] = { attempted: 0, correct: 0, timeTotal: 0 };
        }
        if (userAnswer !== null) {
          results.topicStats[question.topic].attempted++;
          if (isCorrect) results.topicStats[question.topic].correct++;
        }
        results.topicStats[question.topic].timeTotal += timeSpent;
        
        // Difficulty stats
        if (!results.difficultyStats[question.difficulty]) {
          results.difficultyStats[question.difficulty] = { attempted: 0, correct: 0, timeTotal: 0 };
        }
        if (userAnswer !== null) {
          results.difficultyStats[question.difficulty].attempted++;
          if (isCorrect) results.difficultyStats[question.difficulty].correct++;
        }
        results.difficultyStats[question.difficulty].timeTotal += timeSpent;
      }
      
      this.stateManager.setResults(results);
    } catch (error) {
      console.error('Calculate results error:', error);
    }
  }

  // Display test results
  displayResults() {
    try {
      const results = this.stateManager.getResults();
      if (!results) return;
      
      const scorePercentage = Math.round((results.score / results.totalQuestions) * 100);
      
      // Update score display
      this.viewManager.updateElement('score-percentage', `${scorePercentage}%`);
      this.viewManager.updateElement('correct-answers', `${results.score}/${results.totalQuestions}`);
      this.viewManager.updateElement('total-time', this.formatTime(results.totalTime));
      
      const avgTime = Math.round(results.totalTime / results.totalQuestions);
      this.viewManager.updateElement('avg-time', this.formatTime(avgTime));
      
      // Setup and draw charts
      this.setupCharts();
      this.drawTopicChart(results.topicStats);
      this.drawDifficultyChart(results.difficultyStats);
      
      // Phase 4: Generate and display advanced analytics
      this.generateAndDisplayAdvancedAnalytics(results);
      
      // Display analysis
      this.displayAnalysis(results);
      
      // Populate results table
      this.populateResultsTable(results.questionResults);
    } catch (error) {
      console.error('Display results error:', error);
    }
  }

  // Setup chart canvases
  setupCharts() {
    try {
      ['topic-chart', 'difficulty-chart'].forEach(chartId => {
        const canvas = document.getElementById(chartId);
        if (canvas) {
          const container = canvas.parentElement;
          const rect = container.getBoundingClientRect();
          canvas.width = rect.width || 300;
          canvas.height = rect.height || 300;
        }
      });
    } catch (error) {
      console.error('Setup charts error:', error);
    }
  }

  // Draw topic-wise accuracy chart
  drawTopicChart(topicStats) {
    try {
      const canvas = document.getElementById('topic-chart');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const topics = Object.keys(topicStats);
      const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325'];
      
      let total = 0;
      topics.forEach(topic => {
        if (topicStats[topic].attempted > 0) {
          total += topicStats[topic].attempted;
        }
      });
      
      if (total === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', centerX, centerY);
        return;
      }
      
      let currentAngle = -Math.PI / 2;
      
      topics.forEach((topic, index) => {
        if (topicStats[topic].attempted > 0) {
          const percentage = topicStats[topic].attempted / total;
          const sliceAngle = percentage * 2 * Math.PI;
          const accuracy = topicStats[topic].correct / topicStats[topic].attempted * 100;
          
          // Draw slice
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
          ctx.closePath();
          ctx.fillStyle = colors[index % colors.length];
          ctx.fill();
          
          // Draw label
          const labelAngle = currentAngle + sliceAngle / 2;
          const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
          const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
          
          ctx.fillStyle = '#000';
          ctx.font = '12px Roboto';
          ctx.textAlign = 'center';
          ctx.fillText(`${topic}`, labelX, labelY - 5);
          ctx.fillText(`${accuracy.toFixed(0)}%`, labelX, labelY + 10);
          
          currentAngle += sliceAngle;
        }
      });
    } catch (error) {
      console.error('Draw topic chart error:', error);
    }
  }

  // Draw difficulty-wise performance chart
  drawDifficultyChart(difficultyStats) {
    try {
      const canvas = document.getElementById('difficulty-chart');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const difficulties = ['Easy', 'Medium', 'Hard'];
      const colors = ['#1FB8CD', '#FFC185', '#B4413C'];
      const barWidth = (canvas.width / difficulties.length) - 40;
      const maxHeight = canvas.height - 60;
      
      let maxValue = 0;
      difficulties.forEach(diff => {
        if (difficultyStats[diff] && difficultyStats[diff].attempted > 0) {
          const accuracy = difficultyStats[diff].correct / difficultyStats[diff].attempted;
          maxValue = Math.max(maxValue, accuracy);
        }
      });
      
      if (maxValue === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
        return;
      }
      
      difficulties.forEach((diff, index) => {
        const stats = difficultyStats[diff];
        if (stats && stats.attempted > 0) {
          const accuracy = stats.correct / stats.attempted;
          const barHeight = (accuracy / maxValue) * maxHeight;
          const x = 20 + index * (barWidth + 20);
          const y = canvas.height - 40 - barHeight;
          
          // Draw bar
          ctx.fillStyle = colors[index];
          ctx.fillRect(x, y, barWidth, barHeight);
          
          // Draw label
          ctx.fillStyle = '#000';
          ctx.font = '14px Roboto';
          ctx.textAlign = 'center';
          ctx.fillText(diff, x + barWidth / 2, canvas.height - 20);
          ctx.fillText(`${(accuracy * 100).toFixed(0)}%`, x + barWidth / 2, y - 5);
        }
      });
    } catch (error) {
      console.error('Draw difficulty chart error:', error);
    }
  }

  // Display performance analysis
  displayAnalysis(results) {
    try {
      // Strengths and weaknesses
      const topics = Object.entries(results.topicStats)
        .filter(([topic, stats]) => stats.attempted > 0)
        .map(([topic, stats]) => ({
          topic,
          accuracy: stats.correct / stats.attempted,
          avgTime: stats.timeTotal / stats.attempted
        }))
        .sort((a, b) => b.accuracy - a.accuracy);
      
      // Strengths (accuracy > 80%)
      const strengths = topics.filter(t => t.accuracy > 0.8);
      const strengthsList = document.getElementById('strengths-list');
      if (strengthsList) {
        strengthsList.innerHTML = strengths.length === 0 
          ? '<li>Work on improving accuracy to identify strengths</li>'
          : strengths.map(t => `<li>${t.topic}: ${(t.accuracy * 100).toFixed(0)}% accuracy</li>`).join('');
      }
      
      // Weaknesses (accuracy < 60%)
      const weaknesses = topics.filter(t => t.accuracy < 0.6);
      const weaknessesList = document.getElementById('weaknesses-list');
      if (weaknessesList) {
        weaknessesList.innerHTML = weaknesses.length === 0
          ? '<li>Great job! No major weak areas identified</li>'
          : weaknesses.map(t => `<li>${t.topic}: ${(t.accuracy * 100).toFixed(0)}% accuracy</li>`).join('');
      }
      
      // Study recommendations
      const studyActions = [];
      
      // Top 3 weakest topics
      const topWeaknesses = topics.slice(-3).reverse();
      topWeaknesses.forEach((topic, index) => {
        if (topic.accuracy < 0.7) {
          studyActions.push(`Focus on ${topic.topic} - Review NCERT Physics Chapter on Units & Measurements`);
        }
      });
      
      // Topics with high time consumption
      const slowTopics = topics.filter(t => t.avgTime > 90).slice(0, 2);
      slowTopics.forEach(topic => {
        studyActions.push(`Practice more ${topic.topic} problems to improve speed`);
      });
      
      // Generic recommendations
      if (studyActions.length < 5) {
        const generic = [
          'Practice dimensional analysis shortcuts and tricks',
          'Memorize common dimensional formulas',
          'Solve 20 additional practice problems daily',
          'Take more timed mock tests',
          'Review solutions for all incorrect answers'
        ];
        
        generic.forEach(action => {
          if (studyActions.length < 5) {
            studyActions.push(action);
          }
        });
      }
      
      const studyActionsList = document.getElementById('study-actions');
      if (studyActionsList) {
        studyActionsList.innerHTML = studyActions
          .slice(0, 5)
          .map(action => `<li>${action}</li>`)
          .join('');
      }
    } catch (error) {
      console.error('Display analysis error:', error);
    }
  }

  // Populate results table
  populateResultsTable(questionResults) {
    try {
      const tbody = document.querySelector('#results-table tbody');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      questionResults.forEach(result => {
        const row = tbody.insertRow();
        row.innerHTML = `
          <td>${result.questionId}</td>
          <td>${result.topic}</td>
          <td>${result.difficulty}</td>
          <td class="${result.status}-status">${result.status.charAt(0).toUpperCase() + result.status.slice(1)}</td>
          <td>${this.formatTime(result.timeSpent * 1000)}</td>
        `;
      });
    } catch (error) {
      console.error('Populate results table error:', error);
    }
  }

  // Populate review answers for review view
  populateReviewAnswers() {
    try {
      const currentQuestions = this.getCurrentQuestions();
      const state = this.stateManager.getState();
      const results = this.stateManager.getResults();
      
      if (!results) return;
      
      const reviewContainer = document.getElementById('review-answers-container');
      if (!reviewContainer) return;
      
      reviewContainer.innerHTML = '';
      
      currentQuestions.forEach((question, index) => {
        const userAnswer = state.answers[index];
        const isCorrect = userAnswer !== null && userAnswer === question.correctIndex;
        const timeSpent = state.timeSpent[index] || 0;
        
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-answer-item ${isCorrect ? 'correct' : userAnswer !== null ? 'incorrect' : 'unanswered'}`;
        
        reviewItem.innerHTML = `
          <div class="review-question-header">
            <h3>Question ${index + 1}</h3>
            <div class="review-badges">
              <span class="topic-badge">${question.topic}</span>
              <span class="difficulty-badge ${question.difficulty.toLowerCase()}">${question.difficulty}</span>
              <span class="status-badge ${isCorrect ? 'correct' : userAnswer !== null ? 'incorrect' : 'unanswered'}">
                ${userAnswer === null ? 'Not Answered' : isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
          </div>
          <div class="review-question-text">${question.question}</div>
          <div class="review-options">
            ${question.options.map((option, optIndex) => `
              <div class="review-option ${userAnswer === optIndex ? 'user-selected' : ''} ${optIndex === question.correctIndex ? 'correct-answer' : ''}">
                <span class="option-label">${String.fromCharCode(65 + optIndex)}.</span>
                <span class="option-text">${option}</span>
                ${userAnswer === optIndex ? '<span class="user-mark">Your Answer</span>' : ''}
                ${optIndex === question.correctIndex ? '<span class="correct-mark">Correct Answer</span>' : ''}
              </div>
            `).join('')}
          </div>
          <div class="review-stats">
            <span class="time-spent">Time: ${this.formatTime(timeSpent * 1000)}</span>
          </div>
        `;
        
        reviewContainer.appendChild(reviewItem);
      });
    } catch (error) {
      console.error('Populate review answers error:', error);
    }
  }

  // Get current questions
  getCurrentQuestions() {
    const state = this.stateManager.getState();
    return state.customQuestions || window.DEFAULT_QUESTIONS || [];
  }

  // Phase 4: Generate and display advanced analytics
  generateAndDisplayAdvancedAnalytics(results) {
    try {
      // Access the main app instance to use analytics methods
      if (window.app && typeof window.app.generateAdvancedAnalytics === 'function') {
        window.app.generateAdvancedAnalytics(results);
      } else {
        console.warn('Advanced analytics not available - app instance not found');
      }
    } catch (error) {
      console.error('Generate advanced analytics error:', error);
    }
  }
}

// Make TestManager globally available
window.TestManager = TestManager;

// Export for browser use - attach to window object
window.TestManager = TestManager;
