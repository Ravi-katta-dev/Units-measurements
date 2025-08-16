// Data Visualization Module
// Handles Chart.js integration and creates interactive charts for results analysis

class Charts {
  constructor() {
    // Prevent duplicate initialization
    if (Charts.instance) {
      return Charts.instance;
    }
    
    this.charts = new Map();
    this.colors = {
      primary: '#1FB8CD',
      secondary: '#FFC185',
      danger: '#B4413C',
      success: '#28a745',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40'
    };
    this.chartTheme = 'light';
    
    this.init();
    
    // Store singleton instance
    Charts.instance = this;
  }

  // Initialize charts module
  init() {
    this.setupChartDefaults();
    console.log('Charts module initialized');
  }

  // Setup default Chart.js configuration
  setupChartDefaults() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded. Charts functionality will be limited.');
      return;
    }

    Chart.defaults.font.family = 'Roboto, system-ui, -apple-system, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.plugins.legend.display = true;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
    Chart.defaults.plugins.tooltip.bodyColor = '#ffffff';
    Chart.defaults.plugins.tooltip.cornerRadius = 6;
  }

  // Create circular progress chart for score visualization
  createScoreChart(containerId, score, totalQuestions, options = {}) {
    const canvas = this.getOrCreateCanvas(containerId, 'score-chart');
    if (!canvas) return null;

    const percentage = Math.round((score / totalQuestions) * 100);
    const remaining = totalQuestions - score;

    const config = {
      type: 'doughnut',
      data: {
        labels: ['Correct', 'Incorrect/Unanswered'],
        datasets: [{
          data: [score, remaining],
          backgroundColor: [
            this.getScoreColor(percentage),
            '#e9ecef'
          ],
          borderWidth: 0,
          cutout: '70%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw;
                const percent = Math.round((value / totalQuestions) * 100);
                return `${label}: ${value} (${percent}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: !this.isReducedMotion(),
          duration: this.isReducedMotion() ? 0 : 1000
        },
        ...options
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart) => {
          const { ctx, chartArea } = chart;
          if (!chartArea) return;

          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2;

          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Score percentage
          ctx.font = 'bold 24px Roboto';
          ctx.fillStyle = this.getScoreColor(percentage);
          ctx.fillText(`${percentage}%`, centerX, centerY - 10);

          // Score fraction
          ctx.font = '14px Roboto';
          ctx.fillStyle = this.chartTheme === 'dark' ? '#ffffff' : '#6c757d';
          ctx.fillText(`${score}/${totalQuestions}`, centerX, centerY + 15);

          ctx.restore();
        }
      }]
    };

    const chart = new Chart(canvas, config);
    this.charts.set(containerId, chart);
    return chart;
  }

  // Create topic-wise performance bar chart
  createTopicChart(containerId, topicStats, options = {}) {
    const canvas = this.getOrCreateCanvas(containerId, 'topic-chart');
    if (!canvas) return null;

    const topics = Object.keys(topicStats);
    const accuracyData = topics.map(topic => {
      const stats = topicStats[topic];
      return stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
    });

    const config = {
      type: 'bar',
      data: {
        labels: topics,
        datasets: [{
          label: 'Accuracy (%)',
          data: accuracyData,
          backgroundColor: this.colors.primary,
          borderColor: this.colors.primary,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`
            },
            grid: {
              color: this.chartTheme === 'dark' ? '#495057' : '#e9ecef'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 45,
              minRotation: 0
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const topic = topics[context.dataIndex];
                const stats = topicStats[topic];
                return [
                  `Accuracy: ${context.parsed.y}%`,
                  `Correct: ${stats.correct}/${stats.attempted}`,
                  `Total Questions: ${stats.total}`
                ];
              }
            }
          }
        },
        animation: {
          duration: this.isReducedMotion() ? 0 : 1000,
          easing: 'easeOutQuart'
        },
        ...options
      }
    };

    const chart = new Chart(canvas, config);
    this.charts.set(containerId, chart);
    return chart;
  }

  // Create difficulty-wise performance chart
  createDifficultyChart(containerId, difficultyStats, options = {}) {
    const canvas = this.getOrCreateCanvas(containerId, 'difficulty-chart');
    if (!canvas) return null;

    const difficulties = ['Easy', 'Medium', 'Hard'];
    const colors = [this.colors.success, this.colors.warning, this.colors.danger];
    
    const datasets = [{
      label: 'Correct',
      data: difficulties.map(diff => difficultyStats[diff]?.correct || 0),
      backgroundColor: colors.map(color => color + '80'), // Add transparency
      borderColor: colors,
      borderWidth: 2
    }, {
      label: 'Incorrect',
      data: difficulties.map(diff => {
        const stats = difficultyStats[diff];
        return stats ? (stats.attempted - stats.correct) : 0;
      }),
      backgroundColor: colors.map(() => '#e9ecef80'),
      borderColor: colors.map(() => '#6c757d'),
      borderWidth: 2
    }];

    const config = {
      type: 'bar',
      data: {
        labels: difficulties,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: this.chartTheme === 'dark' ? '#495057' : '#e9ecef'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              footer: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                const difficulty = difficulties[index];
                const stats = difficultyStats[difficulty];
                if (stats && stats.attempted > 0) {
                  const accuracy = Math.round((stats.correct / stats.attempted) * 100);
                  return `Accuracy: ${accuracy}%`;
                }
                return '';
              }
            }
          }
        },
        animation: {
          duration: this.isReducedMotion() ? 0 : 1000
        },
        ...options
      }
    };

    const chart = new Chart(canvas, config);
    this.charts.set(containerId, chart);
    return chart;
  }

  // Create time analysis chart
  createTimeChart(containerId, timeData, options = {}) {
    const canvas = this.getOrCreateCanvas(containerId, 'time-chart');
    if (!canvas) return null;

    const questionNumbers = timeData.map((_, index) => `Q${index + 1}`);
    const times = timeData.map(time => Math.round(time / 1000)); // Convert to seconds

    const config = {
      type: 'line',
      data: {
        labels: questionNumbers,
        datasets: [{
          label: 'Time Spent (seconds)',
          data: times,
          borderColor: this.colors.primary,
          backgroundColor: this.colors.primary + '20',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Time (seconds)'
            },
            grid: {
              color: this.chartTheme === 'dark' ? '#495057' : '#e9ecef'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Questions'
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const seconds = context.parsed.y;
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                return `Time: ${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
              }
            }
          }
        },
        animation: {
          duration: this.isReducedMotion() ? 0 : 1000
        },
        ...options
      }
    };

    const chart = new Chart(canvas, config);
    this.charts.set(containerId, chart);
    return chart;
  }

  // Create performance trend chart (for multiple attempts)
  createTrendChart(containerId, attempts, options = {}) {
    const canvas = this.getOrCreateCanvas(containerId, 'trend-chart');
    if (!canvas) return null;

    const attemptLabels = attempts.map((_, index) => `Attempt ${index + 1}`);
    const scores = attempts.map(attempt => attempt.percentage);

    const config = {
      type: 'line',
      data: {
        labels: attemptLabels,
        datasets: [{
          label: 'Score Percentage',
          data: scores,
          borderColor: this.colors.primary,
          backgroundColor: this.colors.primary + '20',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: this.colors.primary,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Score Percentage'
            },
            ticks: {
              callback: (value) => `${value}%`
            },
            grid: {
              color: this.chartTheme === 'dark' ? '#495057' : '#e9ecef'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Test Attempts'
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        animation: {
          duration: this.isReducedMotion() ? 0 : 1500
        },
        ...options
      }
    };

    const chart = new Chart(canvas, config);
    this.charts.set(containerId, chart);
    return chart;
  }

  // Utility methods
  getOrCreateCanvas(containerId, chartId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container ${containerId} not found`);
      return null;
    }

    let canvas = container.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = chartId;
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'Data visualization chart');
      container.appendChild(canvas);
    }

    return canvas;
  }

  getScoreColor(percentage) {
    if (percentage >= 80) return this.colors.success;
    if (percentage >= 60) return this.colors.warning;
    if (percentage >= 40) return this.colors.secondary;
    return this.colors.danger;
  }

  isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Theme support
  setTheme(theme) {
    this.chartTheme = theme;
    
    // Update all existing charts
    this.charts.forEach((chart) => {
      this.updateChartTheme(chart);
    });
  }

  updateChartTheme(chart) {
    const textColor = this.chartTheme === 'dark' ? '#ffffff' : '#333333';
    const gridColor = this.chartTheme === 'dark' ? '#495057' : '#e9ecef';

    chart.options.plugins.legend.labels.color = textColor;
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.x.grid.color = gridColor;
    chart.options.scales.y.grid.color = gridColor;

    chart.update();
  }

  // Export chart as image
  exportChart(chartId, filename, format = 'png') {
    const chart = this.charts.get(chartId);
    if (!chart) return false;

    const url = chart.toBase64Image(format, 1.0);
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = url;
    link.click();

    return true;
  }

  // Destroy specific chart
  destroyChart(containerId) {
    const chart = this.charts.get(containerId);
    if (chart) {
      chart.destroy();
      this.charts.delete(containerId);
    }
  }

  // Destroy all charts
  destroyAll() {
    this.charts.forEach((chart, id) => { // eslint-disable-line no-unused-vars
      chart.destroy();
    });
    this.charts.clear();
  }

  // Update chart data
  updateChart(containerId, newData) {
    const chart = this.charts.get(containerId);
    if (!chart) return false;

    chart.data = { ...chart.data, ...newData };
    chart.update();
    return true;
  }

  // Resize chart
  resizeChart(containerId) {
    const chart = this.charts.get(containerId);
    if (chart) {
      chart.resize();
    }
  }

  // Responsive chart handling
  handleResize() {
    this.charts.forEach((chart) => {
      chart.resize();
    });
  }
}

// Export for browser use - attach to window object
window.Charts = Charts;