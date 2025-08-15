// Local Storage Manager
// Handles data persistence, settings management, and session storage

class AppStorage {
  constructor() {
    // Prevent duplicate initialization
    if (AppStorage.instance) {
      return AppStorage.instance;
    }
    
    this.storageKeys = {
      userSettings: 'units-exam-settings',
      testProgress: 'units-exam-progress',
      testHistory: 'units-exam-history',
      customQuestions: 'units-exam-custom-questions',
      preferences: 'units-exam-preferences',
      performance: 'units-exam-performance'
    };
    
    this.version = '1.0.0';
    this.maxHistoryEntries = 50;
    this.compressionThreshold = 10000; // Compress data larger than 10KB
    
    this.init();
    
    // Store singleton instance
    AppStorage.instance = this;
  }

  // Initialize storage manager
  init() {
    this.checkStorageSupport();
    this.checkQuota();
    this.migrateData();
    console.log('Storage module initialized');
  }

  // Check if localStorage is supported and available
  checkStorageSupport() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      this.storageAvailable = true;
    } catch (e) {
      this.storageAvailable = false;
      console.warn('localStorage not available, using memory storage');
      this.memoryStorage = {};
    }
  }

  // Check storage quota and usage
  async checkQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const percentage = quota > 0 ? (usage / quota) * 100 : 0;
        
        console.log(`Storage usage: ${this.formatBytes(usage)} / ${this.formatBytes(quota)} (${percentage.toFixed(1)}%)`);
        
        if (percentage > 80) {
          console.warn('Storage quota nearly full, consider cleanup');
          this.cleanup();
        }
      } catch (error) {
        console.warn('Could not check storage quota:', error);
      }
    }
  }

  // Settings Management
  saveSettings(settings) {
    const data = {
      version: this.version,
      timestamp: Date.now(),
      settings: {
        theme: 'light',
        testDuration: 90,
        questionTimer: 40,
        rrb_mode: false,
        enhanced_timer: true,
        question_grid_sidebar: true,
        sound_alerts: false,
        auto_save: true,
        ...settings
      }
    };

    return this.setItem(this.storageKeys.userSettings, data);
  }

  loadSettings() {
    const data = this.getItem(this.storageKeys.userSettings);
    if (data && data.settings) {
      return data.settings;
    }
    
    // Return default settings
    return {
      theme: 'light',
      testDuration: 90,
      questionTimer: 40,
      rrb_mode: false,
      enhanced_timer: true,
      question_grid_sidebar: true,
      sound_alerts: false,
      auto_save: true
    };
  }

  // Progress Persistence
  saveProgress(progress) {
    const data = {
      version: this.version,
      timestamp: Date.now(),
      progress: {
        currentQ: 1,
        answers: {},
        bookmarked: [],
        timeSpent: {},
        testStart: null,
        testEnd: null,
        testDuration: 90,
        isActive: false,
        ...progress
      }
    };

    return this.setItem(this.storageKeys.testProgress, data);
  }

  loadProgress() {
    const data = this.getItem(this.storageKeys.testProgress);
    if (data && data.progress) {
      return data.progress;
    }
    return null;
  }

  clearProgress() {
    return this.removeItem(this.storageKeys.testProgress);
  }

  // Test History Management
  saveTestResult(result) {
    const history = this.loadTestHistory();
    
    const testData = {
      id: `test_${Date.now()}`,
      timestamp: Date.now(),
      score: result.score || 0,
      totalQuestions: result.totalQuestions || 0,
      percentage: result.percentage || 0,
      timeSpent: result.timeSpent || 0,
      testDuration: result.testDuration || 0,
      topicStats: result.topicStats || {},
      difficultyStats: result.difficultyStats || {},
      questionTimes: result.questionTimes || [],
      answers: result.answers || {},
      bookmarked: result.bookmarked || [],
      version: this.version
    };

    history.push(testData);

    // Keep only the most recent entries
    if (history.length > this.maxHistoryEntries) {
      history.splice(0, history.length - this.maxHistoryEntries);
    }

    return this.setItem(this.storageKeys.testHistory, {
      version: this.version,
      timestamp: Date.now(),
      history: history
    });
  }

  loadTestHistory() {
    const data = this.getItem(this.storageKeys.testHistory);
    if (data && data.history && Array.isArray(data.history)) {
      return data.history;
    }
    return [];
  }

  getTestById(testId) {
    const history = this.loadTestHistory();
    return history.find(test => test.id === testId);
  }

  deleteTestResult(testId) {
    const history = this.loadTestHistory();
    const filteredHistory = history.filter(test => test.id !== testId);
    
    return this.setItem(this.storageKeys.testHistory, {
      version: this.version,
      timestamp: Date.now(),
      history: filteredHistory
    });
  }

  clearTestHistory() {
    return this.removeItem(this.storageKeys.testHistory);
  }

  // Custom Questions Management
  saveCustomQuestions(questions) {
    const data = {
      version: this.version,
      timestamp: Date.now(),
      questions: questions,
      count: questions.length
    };

    return this.setItem(this.storageKeys.customQuestions, data);
  }

  loadCustomQuestions() {
    const data = this.getItem(this.storageKeys.customQuestions);
    if (data && data.questions && Array.isArray(data.questions)) {
      return data.questions;
    }
    return null;
  }

  clearCustomQuestions() {
    return this.removeItem(this.storageKeys.customQuestions);
  }

  // Performance Analytics
  savePerformanceData(performance) {
    const data = {
      version: this.version,
      timestamp: Date.now(),
      performance: {
        averageScore: 0,
        totalAttempts: 0,
        totalTimeSpent: 0,
        strongTopics: [],
        weakTopics: [],
        improvementTrend: [],
        lastUpdated: Date.now(),
        ...performance
      }
    };

    return this.setItem(this.storageKeys.performance, data);
  }

  loadPerformanceData() {
    const data = this.getItem(this.storageKeys.performance);
    if (data && data.performance) {
      return data.performance;
    }
    return null;
  }

  // Preferences Management
  savePreferences(preferences) {
    const data = {
      version: this.version,
      timestamp: Date.now(),
      preferences: {
        notifications: true,
        autoSave: true,
        dataCollection: false,
        analytics: false,
        ...preferences
      }
    };

    return this.setItem(this.storageKeys.preferences, data);
  }

  loadPreferences() {
    const data = this.getItem(this.storageKeys.preferences);
    if (data && data.preferences) {
      return data.preferences;
    }
    
    return {
      notifications: true,
      autoSave: true,
      dataCollection: false,
      analytics: false
    };
  }

  // Low-level storage operations
  setItem(key, value) {
    try {
      const serialized = this.serialize(value);
      
      if (this.storageAvailable) {
        localStorage.setItem(key, serialized);
      } else {
        this.memoryStorage[key] = serialized;
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      
      if (error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded();
      }
      
      return false;
    }
  }

  getItem(key) {
    try {
      let serialized;
      
      if (this.storageAvailable) {
        serialized = localStorage.getItem(key);
      } else {
        serialized = this.memoryStorage[key];
      }
      
      if (serialized === null || serialized === undefined) {
        return null;
      }
      
      return this.deserialize(serialized);
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return null;
    }
  }

  removeItem(key) {
    try {
      if (this.storageAvailable) {
        localStorage.removeItem(key);
      } else {
        delete this.memoryStorage[key];
      }
      return true;
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
      return false;
    }
  }

  // Data serialization/deserialization
  serialize(data) {
    const jsonString = JSON.stringify(data);
    
    // Compress large data
    if (jsonString.length > this.compressionThreshold) {
      return this.compress(jsonString);
    }
    
    return jsonString;
  }

  deserialize(serialized) {
    // Check if data is compressed
    if (serialized.startsWith('COMPRESSED:')) {
      serialized = this.decompress(serialized);
    }
    
    return JSON.parse(serialized);
  }

  // Simple compression (you might want to use a library like LZ-string for better compression)
  compress(data) {
    // Basic RLE compression for demo - in production, use a proper compression library
    return 'COMPRESSED:' + data;
  }

  decompress(compressedData) {
    return compressedData.replace('COMPRESSED:', '');
  }

  // Data migration for version updates
  migrateData() {
    const currentVersion = this.version;
    
    // Check each storage key for version compatibility
    Object.values(this.storageKeys).forEach(key => {
      const data = this.getItem(key);
      if (data && data.version && data.version !== currentVersion) {
        console.log(`Migrating ${key} from version ${data.version} to ${currentVersion}`);
        this.migrateDataStructure(key, data);
      }
    });
  }

  migrateDataStructure(key, data) {
    // Handle migration logic based on versions
    // This is where you'd implement version-specific migrations
    
    // Update version and save
    data.version = this.version;
    data.migrated = Date.now();
    this.setItem(key, data);
  }

  // Storage cleanup and maintenance
  cleanup() {
    console.log('Starting storage cleanup...');
    
    // Clean old test history entries
    const history = this.loadTestHistory();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentHistory = history.filter(test => test.timestamp > thirtyDaysAgo);
    
    if (recentHistory.length < history.length) {
      this.setItem(this.storageKeys.testHistory, {
        version: this.version,
        timestamp: Date.now(),
        history: recentHistory
      });
      console.log(`Cleaned ${history.length - recentHistory.length} old test entries`);
    }
    
    // Remove any corrupted data
    this.validateAndCleanData();
  }

  validateAndCleanData() {
    Object.values(this.storageKeys).forEach(key => {
      const data = this.getItem(key);
      if (data === null) {
        // Try to recover or remove corrupted entries
        this.removeItem(key);
      }
    });
  }

  handleQuotaExceeded() {
    console.warn('Storage quota exceeded, performing emergency cleanup');
    
    // Clear old data in order of importance
    this.clearTestHistory();
    this.clearProgress();
    this.clearCustomQuestions();
    
    // Show user notification
    if (window.UI && window.UI.showToast) {
      window.UI.showToast(
        'Storage is full. Some data has been cleared to free up space.',
        'warning',
        5000
      );
    }
  }

  // Data export/import
  exportAllData() {
    const exportData = {
      version: this.version,
      timestamp: Date.now(),
      settings: this.loadSettings(),
      history: this.loadTestHistory(),
      customQuestions: this.loadCustomQuestions(),
      performance: this.loadPerformanceData(),
      preferences: this.loadPreferences()
    };

    return exportData;
  }

  importData(importData) {
    try {
      if (importData.settings) {
        this.saveSettings(importData.settings);
      }
      
      if (importData.history && Array.isArray(importData.history)) {
        this.setItem(this.storageKeys.testHistory, {
          version: this.version,
          timestamp: Date.now(),
          history: importData.history
        });
      }
      
      if (importData.customQuestions) {
        this.saveCustomQuestions(importData.customQuestions);
      }
      
      if (importData.performance) {
        this.savePerformanceData(importData.performance);
      }
      
      if (importData.preferences) {
        this.savePreferences(importData.preferences);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Utility methods
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getStorageInfo() {
    const info = {
      available: this.storageAvailable,
      keys: Object.keys(this.storageKeys),
      sizes: {}
    };

    Object.entries(this.storageKeys).forEach(([name, key]) => {
      const data = this.getItem(key);
      if (data) {
        const size = JSON.stringify(data).length;
        info.sizes[name] = this.formatBytes(size);
      }
    });

    return info;
  }

  // Clear all data
  clearAllData() {
    Object.values(this.storageKeys).forEach(key => {
      this.removeItem(key);
    });
    
    console.log('All application data cleared');
    return true;
  }
}

// Export for browser use - attach to window object
window.AppStorage = AppStorage;