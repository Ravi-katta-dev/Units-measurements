// Phase 5: Adaptive Learning System
// AI-powered adaptive learning system that adjusts difficulty and provides personalized recommendations

class AdaptiveSystem {
  constructor() {
    // Prevent duplicate initialization
    if (AdaptiveSystem.instance) {
      return AdaptiveSystem.instance;
    }
    
    this.performanceHistory = [];
    this.learningProfile = {
      strengths: [],
      weaknesses: [],
      preferredDifficulty: 'medium',
      avgResponseTime: 0,
      consistencyScore: 0
    };
    this.recommendations = [];
    this.adaptiveSettings = {
      enabled: false,
      difficultyAdjustment: true,
      personalizedRecommendations: true,
      intelligentTimer: false
    };
    
    this.init();
    AdaptiveSystem.instance = this;
  }
  
  init() {
    this.loadLearningProfile();
    this.setupAdaptiveUI();
    console.log('Adaptive Learning System initialized');
  }
  
  // Load saved learning profile
  loadLearningProfile() {
    try {
      const saved = localStorage.getItem('adaptiveLearningProfile');
      if (saved) {
        this.learningProfile = { ...this.learningProfile, ...JSON.parse(saved) };
      }
      
      const settings = localStorage.getItem('adaptiveSettings');
      if (settings) {
        this.adaptiveSettings = { ...this.adaptiveSettings, ...JSON.parse(settings) };
      }
    } catch (error) {
      console.warn('Failed to load learning profile:', error);
    }
  }
  
  // Save learning profile
  saveLearningProfile() {
    try {
      localStorage.setItem('adaptiveLearningProfile', JSON.stringify(this.learningProfile));
      localStorage.setItem('adaptiveSettings', JSON.stringify(this.adaptiveSettings));
    } catch (error) {
      console.warn('Failed to save learning profile:', error);
    }
  }
  
  // Setup adaptive UI components
  setupAdaptiveUI() {
    this.createAdaptiveControls();
    this.updateAdaptiveDisplay();
  }
  
  // Create adaptive learning controls
  createAdaptiveControls() {
    const settingsPanel = document.querySelector('.settings-grid');
    if (!settingsPanel) return;
    
    const adaptiveControl = document.createElement('div');
    adaptiveControl.className = 'setting-group enhanced adaptive-learning';
    adaptiveControl.innerHTML = `
      <label class="setting-label">
        <div class="label-content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <div>
            <span class="label-text">AI Adaptive Learning</span>
            <span class="label-description">Personalized difficulty and smart recommendations</span>
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" id="adaptive-learning" ${this.adaptiveSettings.enabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </label>
      
      <div class="adaptive-options ${this.adaptiveSettings.enabled ? '' : 'hidden'}" id="adaptive-options">
        <div class="adaptive-sub-option">
          <label class="setting-label-small">
            <span>Dynamic Difficulty Adjustment</span>
            <label class="switch switch-small">
              <input type="checkbox" id="difficulty-adjustment" ${this.adaptiveSettings.difficultyAdjustment ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </label>
        </div>
        
        <div class="adaptive-sub-option">
          <label class="setting-label-small">
            <span>Personalized Study Plans</span>
            <label class="switch switch-small">
              <input type="checkbox" id="personalized-recommendations" ${this.adaptiveSettings.personalizedRecommendations ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </label>
        </div>
        
        <div class="adaptive-sub-option">
          <label class="setting-label-small">
            <span>Intelligent Timer Adjustment</span>
            <label class="switch switch-small">
              <input type="checkbox" id="intelligent-timer" ${this.adaptiveSettings.intelligentTimer ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </label>
        </div>
      </div>
    `;
    
    settingsPanel.appendChild(adaptiveControl);
    this.setupAdaptiveEventListeners();
  }
  
  // Setup event listeners for adaptive controls
  setupAdaptiveEventListeners() {
    const adaptiveLearning = document.getElementById('adaptive-learning');
    const difficultyAdjustment = document.getElementById('difficulty-adjustment');
    const personalizedRecommendations = document.getElementById('personalized-recommendations');
    const intelligentTimer = document.getElementById('intelligent-timer');
    
    if (adaptiveLearning) {
      adaptiveLearning.addEventListener('change', (e) => {
        this.adaptiveSettings.enabled = e.target.checked;
        this.toggleAdaptiveOptions(e.target.checked);
        this.saveLearningProfile();
      });
    }
    
    if (difficultyAdjustment) {
      difficultyAdjustment.addEventListener('change', (e) => {
        this.adaptiveSettings.difficultyAdjustment = e.target.checked;
        this.saveLearningProfile();
      });
    }
    
    if (personalizedRecommendations) {
      personalizedRecommendations.addEventListener('change', (e) => {
        this.adaptiveSettings.personalizedRecommendations = e.target.checked;
        this.saveLearningProfile();
      });
    }
    
    if (intelligentTimer) {
      intelligentTimer.addEventListener('change', (e) => {
        this.adaptiveSettings.intelligentTimer = e.target.checked;
        this.saveLearningProfile();
      });
    }
  }
  
  // Toggle adaptive options visibility
  toggleAdaptiveOptions(show) {
    const options = document.getElementById('adaptive-options');
    if (options) {
      options.classList.toggle('hidden', !show);
    }
  }
  
  // Record answer performance
  recordAnswer(questionIndex, isCorrect, timeSpent, difficulty, topic) {
    if (!this.adaptiveSettings.enabled) return;
    
    const performance = {
      questionIndex,
      isCorrect,
      timeSpent,
      difficulty,
      topic,
      timestamp: Date.now()
    };
    
    this.performanceHistory.push(performance);
    this.updateLearningProfile(performance);
    this.generateRecommendations();
    this.saveLearningProfile();
  }
  
  // Update learning profile based on performance
  updateLearningProfile(performance) {
    // Update topic strengths/weaknesses
    if (performance.isCorrect) {
      if (!this.learningProfile.strengths.includes(performance.topic)) {
        this.learningProfile.strengths.push(performance.topic);
      }
      // Remove from weaknesses if present
      this.learningProfile.weaknesses = this.learningProfile.weaknesses.filter(t => t !== performance.topic);
    } else {
      if (!this.learningProfile.weaknesses.includes(performance.topic)) {
        this.learningProfile.weaknesses.push(performance.topic);
      }
    }
    
    // Update average response time
    const recentPerformances = this.performanceHistory.slice(-10);
    this.learningProfile.avgResponseTime = recentPerformances.reduce((sum, p) => sum + p.timeSpent, 0) / recentPerformances.length;
    
    // Calculate consistency score
    this.learningProfile.consistencyScore = this.calculateConsistencyScore();
    
    // Adjust preferred difficulty
    this.adjustPreferredDifficulty();
  }
  
  // Calculate consistency score based on recent performance
  calculateConsistencyScore() {
    const recentPerformances = this.performanceHistory.slice(-20);
    if (recentPerformances.length < 5) return 0;
    
    const correctAnswers = recentPerformances.filter(p => p.isCorrect).length;
    const accuracy = correctAnswers / recentPerformances.length;
    
    // Calculate time consistency (lower variance = higher consistency)
    const times = recentPerformances.map(p => p.timeSpent);
    const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
    const variance = times.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / times.length;
    const timeConsistency = Math.max(0, 1 - (variance / 1000)); // Normalize variance
    
    return (accuracy * 0.7 + timeConsistency * 0.3) * 10; // Scale to 0-10
  }
  
  // Adjust preferred difficulty based on performance
  adjustPreferredDifficulty() {
    if (!this.adaptiveSettings.difficultyAdjustment) return;
    
    const recentPerformances = this.performanceHistory.slice(-15);
    if (recentPerformances.length < 10) return;
    
    const accuracy = recentPerformances.filter(p => p.isCorrect).length / recentPerformances.length;
    const avgTime = recentPerformances.reduce((sum, p) => sum + p.timeSpent, 0) / recentPerformances.length;
    
    if (accuracy > 0.8 && avgTime < 25) {
      this.learningProfile.preferredDifficulty = 'hard';
    } else if (accuracy > 0.6 && avgTime < 35) {
      this.learningProfile.preferredDifficulty = 'medium';
    } else {
      this.learningProfile.preferredDifficulty = 'easy';
    }
  }
  
  // Generate personalized recommendations
  generateRecommendations() {
    if (!this.adaptiveSettings.personalizedRecommendations) return;
    
    this.recommendations = [];
    
    // Topic-based recommendations
    if (this.learningProfile.weaknesses.length > 0) {
      const weakestTopic = this.learningProfile.weaknesses[0];
      this.recommendations.push({
        type: 'topic_focus',
        priority: 'high',
        title: `Master ${weakestTopic}`,
        description: `You've struggled with ${weakestTopic} questions. Focus on these concepts to improve your overall score.`,
        action: 'practice_topic',
        data: { topic: weakestTopic },
        estimatedImpact: '+15% accuracy'
      });
    }
    
    // Time management recommendations
    if (this.learningProfile.avgResponseTime > 30) {
      this.recommendations.push({
        type: 'time_management',
        priority: 'medium',
        title: 'Improve Speed',
        description: 'You spend too much time on questions. Practice quick problem-solving techniques.',
        action: 'speed_training',
        data: { currentAvg: this.learningProfile.avgResponseTime },
        estimatedImpact: '+20% efficiency'
      });
    }
    
    // Consistency recommendations
    if (this.learningProfile.consistencyScore < 6) {
      this.recommendations.push({
        type: 'consistency',
        priority: 'medium',
        title: 'Build Consistency',
        description: 'Your performance varies significantly. Regular practice will help stabilize your scores.',
        action: 'consistency_training',
        data: { score: this.learningProfile.consistencyScore },
        estimatedImpact: '+12% stability'
      });
    }
    
    // Difficulty recommendations
    if (this.adaptiveSettings.difficultyAdjustment) {
      this.recommendations.push({
        type: 'difficulty',
        priority: 'low',
        title: `Try ${this.learningProfile.preferredDifficulty.charAt(0).toUpperCase() + this.learningProfile.preferredDifficulty.slice(1)} Questions`,
        description: `Based on your performance, ${this.learningProfile.preferredDifficulty} questions are optimal for your current level.`,
        action: 'adjust_difficulty',
        data: { difficulty: this.learningProfile.preferredDifficulty },
        estimatedImpact: '+8% engagement'
      });
    }
  }
  
  // Get adaptive timer duration for question
  getAdaptiveTimerDuration(questionDifficulty, topic) {
    if (!this.adaptiveSettings.intelligentTimer) return 40; // Default 40 seconds
    
    let baseDuration = 40;
    
    // Adjust based on user's average response time for this topic
    const topicPerformances = this.performanceHistory.filter(p => p.topic === topic);
    if (topicPerformances.length > 0) {
      const avgTopicTime = topicPerformances.reduce((sum, p) => sum + p.timeSpent, 0) / topicPerformances.length;
      
      // If user is consistently faster/slower, adjust timer
      if (avgTopicTime < 25) {
        baseDuration = 35; // Reduce for fast responders
      } else if (avgTopicTime > 35) {
        baseDuration = 45; // Increase for slower responders
      }
    }
    
    // Adjust based on difficulty
    switch (questionDifficulty.toLowerCase()) {
      case 'easy':
        return Math.max(30, baseDuration - 5);
      case 'hard':
        return baseDuration + 10;
      default:
        return baseDuration;
    }
  }
  
  // Get recommended questions based on learning profile
  getRecommendedQuestions(allQuestions, count = 50) {
    if (!this.adaptiveSettings.enabled) return allQuestions.slice(0, count);
    
    let recommended = [];
    
    // Prioritize weak topics (40% of questions)
    const weakTopicQuestions = allQuestions.filter(q => 
      this.learningProfile.weaknesses.includes(q.topic)
    );
    
    if (weakTopicQuestions.length > 0) {
      recommended.push(...this.shuffleArray(weakTopicQuestions).slice(0, Math.floor(count * 0.4)));
    }
    
    // Add questions of preferred difficulty (40% of questions)
    const preferredDifficultyQuestions = allQuestions.filter(q => 
      q.difficulty.toLowerCase() === this.learningProfile.preferredDifficulty &&
      !recommended.includes(q)
    );
    
    recommended.push(...this.shuffleArray(preferredDifficultyQuestions).slice(0, Math.floor(count * 0.4)));
    
    // Fill remaining with mixed questions (20% of questions)
    const remainingQuestions = allQuestions.filter(q => !recommended.includes(q));
    recommended.push(...this.shuffleArray(remainingQuestions).slice(0, count - recommended.length));
    
    return recommended.slice(0, count);
  }
  
  // Utility function to shuffle array
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  // Update adaptive display
  updateAdaptiveDisplay() {
    this.updateLearningProfileDisplay();
    this.updateRecommendationsDisplay();
  }
  
  // Update learning profile display
  updateLearningProfileDisplay() {
    // This would typically update a dashboard or profile section
    // For now, we'll just log the profile for debugging
    if (this.adaptiveSettings.enabled) {
      console.log('Learning Profile:', this.learningProfile);
    }
  }
  
  // Update recommendations display
  updateRecommendationsDisplay() {
    const container = document.querySelector('.recommendation-cards');
    if (!container || !this.adaptiveSettings.personalizedRecommendations) return;
    
    container.innerHTML = '';
    
    this.recommendations.forEach(rec => {
      const card = this.createRecommendationCard(rec);
      container.appendChild(card);
    });
  }
  
  // Create recommendation card
  createRecommendationCard(recommendation) {
    const card = document.createElement('div');
    card.className = `recommendation-card adaptive-rec priority-${recommendation.priority}`;
    
    card.innerHTML = `
      <div class="rec-header">
        <div class="rec-type-icon">
          ${this.getRecommendationIcon(recommendation.type)}
        </div>
        <div class="rec-meta">
          <span class="rec-priority">${recommendation.priority} Priority</span>
          <span class="rec-impact">${recommendation.estimatedImpact}</span>
        </div>
      </div>
      <div class="rec-content">
        <h4>${recommendation.title}</h4>
        <p>${recommendation.description}</p>
        <div class="rec-actions">
          <button class="rec-btn adaptive-action" data-action="${recommendation.action}" data-rec-data='${JSON.stringify(recommendation.data)}'>
            ${this.getActionButtonText(recommendation.action)}
          </button>
          <button class="rec-btn-secondary">Learn More</button>
        </div>
      </div>
    `;
    
    return card;
  }
  
  // Get recommendation icon
  getRecommendationIcon(type) {
    const icons = {
      topic_focus: '📚',
      time_management: '⏱️',
      consistency: '🎯',
      difficulty: '📊'
    };
    
    return icons[type] || '💡';
  }
  
  // Get action button text
  getActionButtonText(action) {
    const texts = {
      practice_topic: 'Practice Now',
      speed_training: 'Start Speed Training',
      consistency_training: 'Build Consistency',
      adjust_difficulty: 'Apply Setting'
    };
    
    return texts[action] || 'Take Action';
  }
  
  // Get learning insights for display
  getLearningInsights() {
    return {
      totalQuestions: this.performanceHistory.length,
      accuracy: this.performanceHistory.length > 0 ? 
        (this.performanceHistory.filter(p => p.isCorrect).length / this.performanceHistory.length * 100).toFixed(1) : 0,
      avgResponseTime: this.learningProfile.avgResponseTime.toFixed(1),
      consistencyScore: this.learningProfile.consistencyScore.toFixed(1),
      preferredDifficulty: this.learningProfile.preferredDifficulty,
      strengths: this.learningProfile.strengths,
      weaknesses: this.learningProfile.weaknesses,
      recommendations: this.recommendations.length
    };
  }
  
  // Reset learning profile
  resetLearningProfile() {
    this.performanceHistory = [];
    this.learningProfile = {
      strengths: [],
      weaknesses: [],
      preferredDifficulty: 'medium',
      avgResponseTime: 0,
      consistencyScore: 0
    };
    this.recommendations = [];
    this.saveLearningProfile();
    this.updateAdaptiveDisplay();
  }
}

// Make AdaptiveSystem globally available
window.AdaptiveSystem = AdaptiveSystem;

// Export for browser use - attach to window object
window.AdaptiveSystem = AdaptiveSystem;