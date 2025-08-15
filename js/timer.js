// Enhanced Timer Component for Units-measurements Application
// Provides reusable timer functionality with audio/visual alerts, progress indicators, and 40-second question timer support

class CustomTimer {
  constructor(options = {}) {
    this.duration = options.duration || 60; // Duration in minutes (can be decimal)
    this.element = options.element || null; // DOM element to display timer
    this.progressElement = options.progressElement || null; // Progress indicator element
    this.circularProgress = options.circularProgress || null; // Circular progress element
    this.onTick = options.onTick || null; // Callback for each tick
    this.onComplete = options.onComplete || null; // Callback when timer completes
    this.onWarning = options.onWarning || null; // Callback for warning thresholds
    this.warningThresholds = options.warningThresholds || [10, 5]; // Warning thresholds in seconds for question timer
    this.audioAlert = options.audioAlert !== false; // Enable audio alerts (default: true)
    this.visualAlert = options.visualAlert !== false; // Enable visual alerts (default: true)
    this.isQuestionTimer = options.isQuestionTimer || false; // Special handling for 40-second question timer
    this.autoReset = options.autoReset || false; // Auto-reset for question timer
    
    this.isRunning = false;
    this.isPaused = false;
    this.remainingTime = this.duration * (this.isQuestionTimer ? 1000 : 60 * 1000); // Question timer is in seconds
    this.totalTime = this.remainingTime;
    this.startTime = null;
    this.pausedTime = 0;
    this.interval = null;
    this.warningsTriggered = new Set();
    
    this.init();
  }
  
  init() {
    // Create audio context for alerts if enabled
    if (this.audioAlert && typeof AudioContext !== 'undefined') {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Initialize display
    this.updateDisplay();
    this.updateProgressIndicators();
  }
  
  start() {
    if (this.isRunning && !this.isPaused) return;
    
    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now() - this.pausedTime;
    
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
    
    this.updateDisplay();
  }
  
  pause() {
    if (!this.isRunning || this.isPaused) return;
    
    this.isPaused = true;
    this.pausedTime = Date.now() - this.startTime;
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    this.updateDisplay();
  }
  
  resume() {
    if (!this.isRunning || !this.isPaused) return;
    
    this.isPaused = false;
    this.startTime = Date.now() - this.pausedTime;
    
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
    
    this.updateDisplay();
  }
  
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  tick() {
    const elapsed = Date.now() - this.startTime;
    
    if (this.isQuestionTimer) {
      // For question timer, duration is in seconds
      this.remainingTime = Math.max(0, (this.duration * 1000) - elapsed);
    } else {
      // For exam timer, duration is in minutes
      this.remainingTime = Math.max(0, (this.duration * 60 * 1000) - elapsed);
    }
    
    this.updateDisplay();
    this.checkWarnings();
    
    if (this.onTick) {
      this.onTick(this.remainingTime);
    }
    
    if (this.remainingTime <= 0) {
      this.complete();
    }
  }
  
  complete() {
    this.stop();
    this.triggerAlert('complete');
    
    if (this.onComplete) {
      this.onComplete();
    }
  }
  
  checkWarnings() {
    // Use different logic for question timer vs exam timer
    const remainingTime = this.isQuestionTimer 
      ? Math.ceil(this.remainingTime / 1000) // seconds for question timer
      : Math.ceil(this.remainingTime / (60 * 1000)); // minutes for exam timer
    
    this.warningThresholds.forEach(threshold => {
      if (remainingTime <= threshold && !this.warningsTriggered.has(threshold)) {
        this.warningsTriggered.add(threshold);
        this.triggerAlert('warning', threshold);
        
        if (this.onWarning) {
          this.onWarning(threshold, this.remainingTime);
        }
      }
    });
  }
  
  triggerAlert(type, threshold = null) {
    if (this.audioAlert) {
      this.playAudioAlert(type, threshold);
    }
    
    if (this.visualAlert) {
      this.showVisualAlert(type, threshold);
    }
  }
  
  playAudioAlert(type, threshold) {
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Different frequencies for different alert types
      if (type === 'complete') {
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
      } else if (type === 'warning') {
        const frequency = threshold <= 5 ? 600 : 400; // Higher frequency for more urgent warnings
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.warn('Audio alert failed:', error);
    }
  }
  
  showVisualAlert(type, threshold) {
    if (!this.element) return;
    
    const alertClass = type === 'complete' ? 'timer-complete' : 
                     threshold <= 5 ? 'timer-danger' : 'timer-warning';
    
    this.element.classList.add(alertClass, 'timer-alert');
    
    setTimeout(() => {
      this.element.classList.remove('timer-alert');
    }, 1000);
  }
  
  updateDisplay() {
    if (this.element) {
      const newTimeText = this.formatTime(this.remainingTime);
      
      // Only update text if it changed to prevent unnecessary DOM updates
      if (this.element.textContent !== newTimeText) {
        this.element.textContent = newTimeText;
      }
      
      // Determine new class state
      let newClasses = [];
      
      if (this.isPaused) {
        newClasses.push('paused');
      } else {
        // Enhanced logic for question timer (40 seconds) vs exam timer (minutes)
        if (this.isQuestionTimer) {
          const secondsRemaining = Math.ceil(this.remainingTime / 1000);
          if (secondsRemaining <= 5) {
            newClasses.push('timer-critical', 'danger');
          } else if (secondsRemaining <= 10) {
            newClasses.push('timer-warning', 'warning');
          } else {
            newClasses.push('timer-normal');
          }
        } else {
          const remainingMinutes = this.remainingTime / (60 * 1000);
          if (remainingMinutes <= 5) {
            newClasses.push('danger');
          } else if (remainingMinutes <= 10) {
            newClasses.push('warning');
          }
        }
      }
      
      // Only update classes if they changed to prevent blinking
      const allTimerClasses = ['warning', 'danger', 'paused', 'timer-warning', 'timer-critical', 'timer-normal'];
      const currentClasses = allTimerClasses.filter(cls => this.element.classList.contains(cls));
      const classesChanged = newClasses.length !== currentClasses.length || 
                           !newClasses.every(cls => currentClasses.includes(cls));
      
      if (classesChanged) {
        // Remove all timer-related classes
        this.element.classList.remove(...allTimerClasses);
        // Add new classes
        this.element.classList.add(...newClasses);
      }
    }
    
    // Update progress indicators
    this.updateProgressIndicators();
  }

  // Update progress indicators (linear and circular)
  updateProgressIndicators() {
    const percentage = (this.remainingTime / this.totalTime) * 100;
    
    // Update linear progress bar
    if (this.progressElement) {
      this.progressElement.style.width = `${percentage}%`;
      
      // Color coding for question timer
      if (this.isQuestionTimer) {
        this.progressElement.classList.remove('progress-warning', 'progress-critical', 'progress-normal');
        
        if (percentage <= 12.5) { // Last 5 seconds of 40
          this.progressElement.classList.add('progress-critical');
        } else if (percentage <= 25) { // Last 10 seconds of 40
          this.progressElement.classList.add('progress-warning');
        } else {
          this.progressElement.classList.add('progress-normal');
        }
      }
    }
    
    // Update circular progress indicator
    if (this.circularProgress) {
      const circumference = 2 * Math.PI * 45; // Assuming radius of 45
      const dashOffset = circumference * (1 - percentage / 100);
      this.circularProgress.style.strokeDashoffset = dashOffset;
    }
  }
  
  updateProgress() {
    const totalTime = this.duration * 60 * 1000;
    const progress = Math.max(0, Math.min(100, ((totalTime - this.remainingTime) / totalTime) * 100));
    
    if (this.progressElement.tagName === 'PROGRESS') {
      this.progressElement.value = progress;
    } else {
      // Assume it's a div with progress bar styling
      const progressBar = this.progressElement.querySelector('.progress-bar') || this.progressElement;
      progressBar.style.width = `${progress}%`;
      
      // Update color based on remaining time
      const remainingMinutes = this.remainingTime / (60 * 1000);
      progressBar.classList.remove('progress-warning', 'progress-danger');
      
      if (remainingMinutes <= 5) {
        progressBar.classList.add('progress-danger');
      } else if (remainingMinutes <= 10) {
        progressBar.classList.add('progress-warning');
      }
    }
  }
  
  formatTime(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  // Getter methods for current state
  getRemainingTime() {
    return this.remainingTime;
  }
  
  getRemainingMinutes() {
    return Math.ceil(this.remainingTime / (60 * 1000));
  }
  
  getRemainingSeconds() {
    return Math.ceil(this.remainingTime / 1000);
  }
  
  getProgress() {
    return ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
  }
  
  isActive() {
    return this.isRunning && !this.isPaused;
  }
  
  // Enhanced reset method for question timer
  reset(newDuration = null) {
    this.stop();
    
    if (newDuration !== null) {
      this.duration = newDuration;
    }
    
    this.remainingTime = this.duration * (this.isQuestionTimer ? 1000 : 60 * 1000);
    this.totalTime = this.remainingTime;
    this.pausedTime = 0;
    this.warningsTriggered.clear();
    this.updateDisplay();
    
    // Auto-start if this is a question timer with auto-reset enabled
    if (this.isQuestionTimer && this.autoReset) {
      setTimeout(() => this.start(), 100);
    }
  }
  
  // Method specifically for question timer - reset to 40 seconds
  resetQuestionTimer() {
    if (this.isQuestionTimer) {
      this.reset(40); // 40 seconds
    }
  }
  
  // Setter methods for dynamic configuration
  setDuration(duration) {
    if (!this.isRunning) {
      this.duration = duration; // Can be decimal for fractional minutes, or seconds for question timer
      this.remainingTime = this.duration * (this.isQuestionTimer ? 1000 : 60 * 1000);
      this.totalTime = this.remainingTime;
      this.updateDisplay();
    }
  }
  
  setWarningThresholds(thresholds) {
    this.warningThresholds = thresholds;
    this.warningsTriggered.clear();
  }
  
  enableAudio(enabled = true) {
    this.audioAlert = enabled;
  }
  
  enableVisual(enabled = true) {
    this.visualAlert = enabled;
  }

  // Method to create a question timer instance
  static createQuestionTimer(options = {}) {
    return new CustomTimer({
      duration: 40, // 40 seconds
      isQuestionTimer: true,
      warningThresholds: [10, 5], // 10 and 5 seconds warning
      autoReset: true,
      audioAlert: true,
      visualAlert: true,
      ...options
    });
  }

  // Method to create an exam timer instance  
  static createExamTimer(options = {}) {
    return new CustomTimer({
      duration: 90, // 90 minutes default
      isQuestionTimer: false,
      warningThresholds: [10, 5], // 10 and 5 minutes warning
      audioAlert: true,
      visualAlert: true,
      ...options
    });
  }
}

// Export for browser use - attach to window object
window.CustomTimer = CustomTimer;