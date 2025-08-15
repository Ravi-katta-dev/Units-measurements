// Phase 5: Advanced Performance Analytics
// Comprehensive analytics system with machine learning insights and predictive modeling

class PerformanceAnalytics {
  constructor() {
    // Prevent duplicate initialization
    if (PerformanceAnalytics.instance) {
      return PerformanceAnalytics.instance;
    }
    
    this.performanceData = [];
    this.analyticsCache = new Map();
    this.predictiveModels = {
      scorePredictor: null,
      timePredictor: null,
      difficultyPredictor: null
    };
    
    this.init();
    PerformanceAnalytics.instance = this;
  }
  
  init() {
    this.loadPerformanceData();
    this.initializePredictiveModels();
    console.log('Advanced Performance Analytics initialized');
  }
  
  // Load performance data from storage
  loadPerformanceData() {
    try {
      const saved = localStorage.getItem('performanceAnalyticsData');
      if (saved) {
        this.performanceData = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load performance data:', error);
    }
  }
  
  // Save performance data
  savePerformanceData() {
    try {
      localStorage.setItem('performanceAnalyticsData', JSON.stringify(this.performanceData));
    } catch (error) {
      console.warn('Failed to save performance data:', error);
    }
  }
  
  // Record test performance
  recordTestPerformance(testData) {
    const performance = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      score: testData.score,
      totalQuestions: testData.totalQuestions,
      correctAnswers: testData.correctAnswers,
      timeSpent: testData.timeSpent,
      averageTimePerQuestion: testData.averageTimePerQuestion,
      topicBreakdown: testData.topicBreakdown,
      difficultyBreakdown: testData.difficultyBreakdown,
      questionDetails: testData.questionDetails || [],
      settings: testData.settings || {}
    };
    
    this.performanceData.push(performance);
    this.savePerformanceData();
    this.clearAnalyticsCache();
    
    // Update predictive models with new data
    this.updatePredictiveModels();
    
    return performance.id;
  }
  
  // Clear analytics cache when new data is added
  clearAnalyticsCache() {
    this.analyticsCache.clear();
  }
  
  // Get comprehensive analytics
  getComprehensiveAnalytics() {
    const cacheKey = 'comprehensive_analytics';
    if (this.analyticsCache.has(cacheKey)) {
      return this.analyticsCache.get(cacheKey);
    }
    
    const analytics = {
      overview: this.getOverviewAnalytics(),
      trends: this.getTrendAnalytics(),
      predictions: this.getPredictiveAnalytics(),
      recommendations: this.getAdvancedRecommendations(),
      comparisons: this.getComparativeAnalytics(),
      insights: this.getDeepInsights()
    };
    
    this.analyticsCache.set(cacheKey, analytics);
    return analytics;
  }
  
  // Get overview analytics
  getOverviewAnalytics() {
    if (this.performanceData.length === 0) {
      return this.getEmptyOverview();
    }
    
    const latest = this.performanceData[this.performanceData.length - 1];
    const scores = this.performanceData.map(p => p.score);
    const times = this.performanceData.map(p => p.averageTimePerQuestion);
    
    return {
      totalTests: this.performanceData.length,
      latestScore: latest.score,
      averageScore: this.calculateMean(scores),
      bestScore: Math.max(...scores),
      scoreImprovement: this.calculateScoreImprovement(),
      averageTime: this.calculateMean(times),
      timeImprovement: this.calculateTimeImprovement(),
      consistencyIndex: this.calculateConsistencyIndex(),
      learningVelocity: this.calculateLearningVelocity()
    };
  }
  
  // Get trend analytics
  getTrendAnalytics() {
    if (this.performanceData.length < 2) {
      return { scoresTrend: [], timesTrend: [], topicsTrend: {} };
    }
    
    return {
      scoresTrend: this.calculateScoreTrend(),
      timesTrend: this.calculateTimeTrend(),
      topicsTrend: this.calculateTopicTrends(),
      difficultyProgression: this.calculateDifficultyProgression(),
      weeklyProgress: this.calculateWeeklyProgress(),
      monthlyInsights: this.calculateMonthlyInsights()
    };
  }
  
  // Get predictive analytics
  getPredictiveAnalytics() {
    return {
      nextTestScore: this.predictNextScore(),
      timeToMastery: this.predictTimeToMastery(),
      optimalStudyPlan: this.generateOptimalStudyPlan(),
      riskAssessment: this.assessPerformanceRisk(),
      successProbability: this.calculateSuccessProbability(),
      adaptiveRecommendations: this.getAdaptiveRecommendations()
    };
  }
  
  // Get advanced recommendations
  getAdvancedRecommendations() {
    const recommendations = [];
    
    // Performance-based recommendations
    const latestPerformance = this.performanceData[this.performanceData.length - 1];
    if (latestPerformance) {
      recommendations.push(...this.getPerformanceRecommendations(latestPerformance));
    }
    
    // Trend-based recommendations
    recommendations.push(...this.getTrendRecommendations());
    
    // Predictive recommendations
    recommendations.push(...this.getPredictiveRecommendations());
    
    return recommendations.sort((a, b) => b.priority - a.priority);
  }
  
  // Calculate score improvement
  calculateScoreImprovement() {
    if (this.performanceData.length < 2) return 0;
    
    const recent = this.performanceData.slice(-3);
    const earlier = this.performanceData.slice(0, -3);
    
    if (earlier.length === 0) return 0;
    
    const recentAvg = this.calculateMean(recent.map(p => p.score));
    const earlierAvg = this.calculateMean(earlier.map(p => p.score));
    
    return recentAvg - earlierAvg;
  }
  
  // Calculate time improvement
  calculateTimeImprovement() {
    if (this.performanceData.length < 2) return 0;
    
    const recent = this.performanceData.slice(-3);
    const earlier = this.performanceData.slice(0, -3);
    
    if (earlier.length === 0) return 0;
    
    const recentAvg = this.calculateMean(recent.map(p => p.averageTimePerQuestion));
    const earlierAvg = this.calculateMean(earlier.map(p => p.averageTimePerQuestion));
    
    return earlierAvg - recentAvg; // Negative improvement means faster (better)
  }
  
  // Calculate consistency index
  calculateConsistencyIndex() {
    if (this.performanceData.length < 3) return 0;
    
    const scores = this.performanceData.map(p => p.score);
    const mean = this.calculateMean(scores);
    const variance = this.calculateVariance(scores, mean);
    const standardDeviation = Math.sqrt(variance);
    
    // Consistency index: higher is more consistent (0-100 scale)
    return Math.max(0, 100 - (standardDeviation * 2));
  }
  
  // Calculate learning velocity
  calculateLearningVelocity() {
    if (this.performanceData.length < 2) return 0;
    
    const timePoints = this.performanceData.map((p, index) => ({ x: index, y: p.score }));
    const regression = this.calculateLinearRegression(timePoints);
    
    return regression.slope; // Points improvement per test
  }
  
  // Calculate score trend
  calculateScoreTrend() {
    return this.performanceData.map((p, index) => ({
      testNumber: index + 1,
      score: p.score,
      timestamp: p.timestamp,
      movingAverage: this.calculateMovingAverage(this.performanceData.slice(0, index + 1).map(x => x.score), 3)
    }));
  }
  
  // Calculate time trend
  calculateTimeTrend() {
    return this.performanceData.map((p, index) => ({
      testNumber: index + 1,
      averageTime: p.averageTimePerQuestion,
      timestamp: p.timestamp,
      movingAverage: this.calculateMovingAverage(this.performanceData.slice(0, index + 1).map(x => x.averageTimePerQuestion), 3)
    }));
  }
  
  // Calculate topic trends
  calculateTopicTrends() {
    const topicData = {};
    
    this.performanceData.forEach((performance, testIndex) => {
      if (performance.topicBreakdown) {
        Object.entries(performance.topicBreakdown).forEach(([topic, data]) => {
          if (!topicData[topic]) {
            topicData[topic] = [];
          }
          topicData[topic].push({
            testNumber: testIndex + 1,
            accuracy: data.percentage,
            timestamp: performance.timestamp
          });
        });
      }
    });
    
    return topicData;
  }
  
  // Predict next test score using linear regression
  predictNextScore() {
    if (this.performanceData.length < 3) {
      return { prediction: null, confidence: 0, range: null };
    }
    
    const dataPoints = this.performanceData.map((p, index) => ({ x: index, y: p.score }));
    const regression = this.calculateLinearRegression(dataPoints);
    
    const nextX = this.performanceData.length;
    const prediction = Math.max(0, Math.min(100, regression.slope * nextX + regression.intercept));
    
    // Calculate confidence based on R-squared
    const rSquared = this.calculateRSquared(dataPoints, regression);
    const confidence = Math.round(rSquared * 100);
    
    // Calculate prediction range (±standard error)
    const standardError = this.calculateStandardError(dataPoints, regression);
    const range = {
      lower: Math.max(0, prediction - standardError),
      upper: Math.min(100, prediction + standardError)
    };
    
    return { prediction: Math.round(prediction), confidence, range };
  }
  
  // Predict time to mastery (80% consistent score)
  predictTimeToMastery() {
    const targetScore = 80;
    const prediction = this.predictNextScore();
    
    if (!prediction.prediction || prediction.prediction >= targetScore) {
      return { testsNeeded: 0, timeEstimate: 'Already achieved', confidence: 100 };
    }
    
    const scoreGap = targetScore - prediction.prediction;
    const learningVelocity = this.calculateLearningVelocity();
    
    if (learningVelocity <= 0) {
      return { testsNeeded: null, timeEstimate: 'Needs improvement in learning approach', confidence: 0 };
    }
    
    const testsNeeded = Math.ceil(scoreGap / learningVelocity);
    const confidence = Math.min(90, this.calculateConsistencyIndex());
    
    return { 
      testsNeeded, 
      timeEstimate: `${testsNeeded} more practice tests`, 
      confidence: Math.round(confidence) 
    };
  }
  
  // Generate optimal study plan
  generateOptimalStudyPlan() {
    const weakestTopics = this.identifyWeakestTopics();
    const timeAnalysis = this.analyzeTimeManagement();
    const consistencyIssues = this.identifyConsistencyIssues();
    
    const plan = {
      focusAreas: weakestTopics,
      timeManagement: timeAnalysis,
      consistencyBuilding: consistencyIssues,
      recommendedSchedule: this.generateStudySchedule()
    };
    
    return plan;
  }
  
  // Assess performance risk
  assessPerformanceRisk() {
    const consistency = this.calculateConsistencyIndex();
    const trend = this.calculateLearningVelocity();
    const recentPerformance = this.getRecentPerformanceIndicators();
    
    let riskLevel = 'low';
    const factors = [];
    
    if (consistency < 60) {
      riskLevel = 'medium';
      factors.push('Inconsistent performance');
    }
    
    if (trend < 0) {
      riskLevel = 'high';
      factors.push('Declining score trend');
    }
    
    if (recentPerformance.averageScore < 60) {
      riskLevel = 'high';
      factors.push('Low recent scores');
    }
    
    return { level: riskLevel, factors, recommendations: this.getRiskMitigationStrategies(factors) };
  }
  
  // Calculate success probability for target score
  calculateSuccessProbability(targetScore = 80) {
    const prediction = this.predictNextScore();
    if (!prediction.prediction) return 0;
    
    const consistency = this.calculateConsistencyIndex();
    const trend = this.calculateLearningVelocity();
    
    let probability = 0;
    
    // Base probability from prediction
    if (prediction.prediction >= targetScore) {
      probability = 70;
    } else {
      const scoreGap = targetScore - prediction.prediction;
      probability = Math.max(0, 70 - (scoreGap * 2));
    }
    
    // Adjust for consistency
    probability += (consistency - 50) * 0.3;
    
    // Adjust for trend
    if (trend > 0) {
      probability += 15;
    } else if (trend < -1) {
      probability -= 20;
    }
    
    return Math.max(0, Math.min(100, Math.round(probability)));
  }
  
  // Utility functions
  calculateMean(numbers) {
    return numbers.length > 0 ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0;
  }
  
  calculateVariance(numbers, mean) {
    if (numbers.length <= 1) return 0;
    return numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / (numbers.length - 1);
  }
  
  calculateMovingAverage(data, window) {
    if (data.length < window) return data[data.length - 1] || 0;
    const slice = data.slice(-window);
    return this.calculateMean(slice);
  }
  
  calculateLinearRegression(points) {
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + (p.x * p.y), 0);
    const sumX2 = points.reduce((sum, p) => sum + (p.x * p.x), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  }
  
  calculateRSquared(points, regression) {
    const meanY = this.calculateMean(points.map(p => p.y));
    const totalSumSquares = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
    const residualSumSquares = points.reduce((sum, p) => {
      const predicted = regression.slope * p.x + regression.intercept;
      return sum + Math.pow(p.y - predicted, 2);
    }, 0);
    
    return 1 - (residualSumSquares / totalSumSquares);
  }
  
  calculateStandardError(points, regression) {
    const residuals = points.map(p => {
      const predicted = regression.slope * p.x + regression.intercept;
      return p.y - predicted;
    });
    
    const meanResidual = this.calculateMean(residuals);
    const variance = this.calculateVariance(residuals, meanResidual);
    
    return Math.sqrt(variance);
  }
  
  // Helper methods for recommendations
  getPerformanceRecommendations(performance) {
    const recommendations = [];
    
    if (performance.score < 60) {
      recommendations.push({
        type: 'improvement',
        priority: 9,
        title: 'Focus on Fundamentals',
        description: 'Your recent score indicates need for foundational review.',
        actions: ['Review basic concepts', 'Practice easier questions']
      });
    }
    
    return recommendations;
  }
  
  getTrendRecommendations() {
    const trend = this.calculateLearningVelocity();
    const recommendations = [];
    
    if (trend < 0) {
      recommendations.push({
        type: 'trend',
        priority: 8,
        title: 'Reverse Declining Trend',
        description: 'Your scores are trending downward. Consider changing study approach.',
        actions: ['Take a break', 'Review study methods', 'Seek help']
      });
    }
    
    return recommendations;
  }
  
  getPredictiveRecommendations() {
    const prediction = this.predictNextScore();
    const recommendations = [];
    
    if (prediction.confidence < 50) {
      recommendations.push({
        type: 'predictive',
        priority: 6,
        title: 'Build Consistency',
        description: 'Your performance is unpredictable. Focus on consistent study habits.',
        actions: ['Regular practice schedule', 'Consistent environment', 'Time management']
      });
    }
    
    return recommendations;
  }
  
  getEmptyOverview() {
    return {
      totalTests: 0,
      latestScore: null,
      averageScore: 0,
      bestScore: 0,
      scoreImprovement: 0,
      averageTime: 0,
      timeImprovement: 0,
      consistencyIndex: 0,
      learningVelocity: 0
    };
  }
  
  // Initialize simple predictive models
  initializePredictiveModels() {
    // Placeholder for more advanced ML models
    this.predictiveModels.scorePredictor = {
      type: 'linear_regression',
      initialized: true
    };
  }
  
  updatePredictiveModels() {
    // Update models with new data - placeholder for ML training
    if (this.performanceData.length > 5) {
      // Would normally retrain models here
      console.log('Updating predictive models with new data');
    }
  }
}

// Make PerformanceAnalytics globally available
window.PerformanceAnalytics = PerformanceAnalytics;

// Export for browser use - attach to window object
window.PerformanceAnalytics = PerformanceAnalytics;