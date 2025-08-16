# Units & Measurements Mock Test

A comprehensive, feature-rich Progressive Web Application (PWA) for RRB (Railway Recruitment Board) Units & Measurements mock tests. This application provides an advanced testing environment with adaptive learning, detailed analytics, and offline capabilities.

## 🚀 Live Demo

**GitHub Pages URL:** [https://theprime007.github.io/Units-measurements/](https://theprime007.github.io/Units-measurements/)

Experience the full-featured mock test platform with:
- Interactive question navigation
- Real-time timer and progress tracking
- Comprehensive result analysis
- Adaptive learning recommendations
- Offline-capable PWA functionality

## 🛠️ Tech Stack

### Frontend Technologies
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)** - Modular architecture with classes and modern syntax

### Libraries & Frameworks
- **Chart.js** - Data visualization for performance analytics
- **Inter & Roboto Fonts** - Typography via Google Fonts

### Development Tools
- **Jest** - JavaScript testing framework
- **ESLint** - Code linting and style enforcement
- **npm** - Package management and build scripts

### Progressive Web App Features
- **Service Workers** - Offline functionality and caching
- **Web App Manifest** - Native app-like experience
- **Responsive Design** - Mobile-first approach

### Browser APIs
- **LocalStorage/SessionStorage** - Data persistence
- **Fetch API** - Dynamic content loading
- **Canvas API** - Chart rendering
- **Web Workers** - Performance optimization

## 📁 Folder Structure

```
.
├── .gitignore                          # Git ignore rules
├── components/                         # HTML component templates
│   ├── landing-view.html              # Welcome/settings page
│   ├── result-view.html               # Test results display
│   ├── review-answers-view.html       # Answer review interface
│   ├── review-panel.html              # Quick navigation panel
│   ├── solution-analysis-view.html    # Detailed solution explanations
│   └── test-view.html                 # Main test interface
├── css/                               # Stylesheet modules
│   ├── landing-view.css               # Landing page styles
│   ├── result-view.css                # Results page styles
│   ├── review-answers.css             # Review interface styles
│   ├── review-components.css          # Review panel components
│   ├── style-enhanced.css             # Enhanced UI components
│   ├── style.css                      # Core application styles
│   └── test-view.css                  # Test interface styles
├── data/                              # Question data files
│   └── sample-questions.json          # Sample question set
├── js/                                # JavaScript modules
│   ├── adaptive-system.js             # Adaptive learning engine
│   ├── app-main.js                    # Main application controller
│   ├── charts.js                      # Chart rendering utilities
│   ├── performance-analytics.js       # Analytics and reporting
│   ├── question-manager.js            # Question handling logic
│   ├── questions-data.js              # Question data management
│   ├── state-manager.js               # Application state management
│   ├── storage.js                     # Data persistence utilities
│   ├── test-manager.js                # Test flow management
│   ├── timer.js                       # Timer functionality
│   ├── ui.js                          # UI interaction utilities
│   ├── utils.js                       # Common utility functions
│   └── view-manager.js                # View routing and management
├── tests/                             # Test suite
│   ├── button-functionality.test.js   # Button interaction tests
│   ├── core-functionality.test.js     # Core feature tests
│   ├── cross-browser.test.js          # Browser compatibility tests
│   ├── performance.test.js            # Performance benchmark tests
│   └── setup.js                       # Jest configuration and mocks
├── index.html                         # Main HTML entry point
├── manifest.json                      # PWA manifest configuration
├── package.json                       # npm dependencies and scripts
├── package-lock.json                  # Dependency lock file
└── sw.js                             # Service worker for offline support
```

## 🔧 Installation Guide

### Prerequisites
- **Node.js** (version 16.0 or higher)
- **npm** (usually comes with Node.js)
- **Git** for cloning the repository
- **Modern web browser** (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/theprime007/Units-measurements.git
   cd Units-measurements
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Local Development Server**
   ```bash
   # Option 1: Using npm script (Python required)
   npm run serve
   
   # Option 2: Using any static file server
   npx http-server . -p 8000
   
   # Option 3: Using Python directly
   python3 -m http.server 8000
   ```

4. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Development Setup

5. **Run Tests** (Optional but recommended)
   ```bash
   npm test
   ```

6. **Run Linting** (Optional)
   ```bash
   npm run lint
   ```

### Browser Requirements
- JavaScript enabled
- LocalStorage support
- Canvas API support
- Fetch API support
- CSS Grid and Flexbox support

## 📖 Usage Instructions

### Getting Started

1. **Launch the Application**
   - Open the application in your browser
   - The landing page will display with test configuration options

2. **Configure Test Settings**
   - **Test Duration**: Choose from preset durations (30min, 45min, 60min) or set custom time
   - **Question Count**: Select number of questions (25, 50, 75, or 100)
   - **Difficulty Level**: Choose from Easy, Medium, Hard, or Mixed
   - **Topics**: Select specific topics or choose "All Topics"

3. **Start the Test**
   - Click "Start Test" to begin
   - The test interface will load with the first question

### During the Test

#### Navigation Controls
- **Previous/Next Buttons**: Navigate between questions
- **Question Number Bar**: Click any number to jump to that question
- **Review Panel**: Access comprehensive question overview

#### Question Management
- **Answer Selection**: Click on any option (A, B, C, D) to select
- **Clear Answer**: Remove your selection for the current question
- **Bookmark Questions**: Mark questions for later review
- **Timer Display**: Monitor remaining time

#### Advanced Features
- **Topic Grouping**: View questions organized by topics
- **Smart Filters**: Filter by answered/unanswered/bookmarked questions
- **Search**: Find specific questions by content
- **Grid View**: Alternative question navigation layout

### Test Completion

4. **Submit Test**
   - Click "Submit Test" when ready or when time expires
   - Confirm submission in the dialog box

5. **View Results**
   - **Score Summary**: Overall percentage and grade
   - **Topic Analysis**: Performance breakdown by subject area
   - **Difficulty Analysis**: Performance across difficulty levels
   - **Time Analytics**: Time spent per question and section
   - **Detailed Charts**: Visual representation of performance

### Post-Test Options

6. **Review Answers**
   - **Solution Review**: See correct answers with explanations
   - **Performance Analysis**: Detailed breakdown of strengths/weaknesses
   - **Recommendation Engine**: Personalized study suggestions

7. **Additional Actions**
   - **Restart Test**: Retake with same questions
   - **New Test**: Generate fresh question set
   - **Export Results**: Download performance data as JSON

### Offline Usage
- The app works offline after the first visit
- Questions and progress are saved locally
- Results are stored until manually cleared

## 💻 Development Guide

### Architecture Overview

The application follows a modular architecture with clear separation of concerns:

#### Core Modules
- **App Main** (`app-main.js`): Central application controller and event coordinator
- **State Manager** (`state-manager.js`): Centralized state management
- **View Manager** (`view-manager.js`): UI routing and component loading
- **Test Manager** (`test-manager.js`): Test logic and flow control

#### Specialized Modules
- **Question Manager** (`question-manager.js`): Question data handling and filtering
- **Timer** (`timer.js`): Countdown and time tracking functionality
- **Storage** (`storage.js`): Data persistence and retrieval
- **UI** (`ui.js`): Common UI interaction utilities
- **Utils** (`utils.js`): Shared utility functions

#### Advanced Features
- **Adaptive System** (`adaptive-system.js`): Machine learning-based recommendations
- **Performance Analytics** (`performance-analytics.js`): Advanced statistics and insights
- **Charts** (`charts.js`): Data visualization utilities

### Code Structure Guidelines

#### JavaScript Modules
```javascript
// Standard module pattern
class ModuleName {
  constructor() {
    // Initialize properties
  }
  
  // Public methods
  publicMethod() {
    // Implementation
  }
  
  // Private methods (use # for private fields in modern browsers)
  #privateMethod() {
    // Implementation
  }
}

// Export for both CommonJS and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModuleName;
}

if (typeof window !== 'undefined') {
  window.ModuleName = ModuleName;
}
```

#### CSS Organization
- **BEM Methodology**: Block__Element--Modifier naming convention
- **CSS Custom Properties**: Use for theming and consistent values
- **Mobile-First**: Responsive design starting from mobile breakpoints
- **Component-Based**: Separate CSS files for major components

#### HTML Components
- **Semantic HTML5**: Use appropriate semantic elements
- **Accessibility**: Include ARIA labels and roles
- **Progressive Enhancement**: Ensure basic functionality without JavaScript

### Adding New Features

#### 1. Adding a New Question Type
```javascript
// In question-manager.js
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  NEW_TYPE: 'new_type' // Add your new type
};
```

#### 2. Creating a New View
1. Create HTML template in `components/`
2. Add corresponding CSS in `css/`
3. Register view in `view-manager.js`
4. Add navigation logic in `app-main.js`

#### 3. Extending Analytics
```javascript
// In performance-analytics.js
class PerformanceAnalytics {
  calculateNewMetric(data) {
    // Your calculation logic
    return result;
  }
}
```

### Development Workflow

1. **Branch Creation**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Development**
   - Make changes in appropriate modules
   - Follow existing code style and patterns
   - Add/update tests for new functionality

3. **Testing**
   ```bash
   npm test                    # Run all tests
   npm run test:watch          # Watch mode for development
   npm run test:coverage       # Generate coverage report
   ```

4. **Linting**
   ```bash
   npm run lint               # Check code style
   ```

5. **Manual Testing**
   - Test in multiple browsers
   - Verify responsive design
   - Check PWA functionality
   - Test offline capabilities

## 🧪 Testing Guide

### Test Framework Setup

The project uses **Jest** as the primary testing framework with **jsdom** for DOM simulation.

#### Test Configuration
- **Framework**: Jest 29.7.0 with jsdom environment
- **Coverage**: Minimum 80% threshold for branches, functions, lines, and statements
- **Setup**: Automated mocks for browser APIs and external libraries

### Test Structure

#### Test Categories

1. **Core Functionality Tests** (`core-functionality.test.js`)
   - Application initialization
   - State management
   - Question loading and navigation
   - Answer handling and validation
   - Timer functionality

2. **Button Functionality Tests** (`button-functionality.test.js`)
   - User interaction handling
   - Event delegation system
   - Button state management
   - Form submission handling

3. **Performance Tests** (`performance.test.js`)
   - DOM manipulation efficiency
   - Memory usage monitoring
   - Component loading times
   - Large dataset handling

4. **Cross-Browser Compatibility Tests** (`cross-browser.test.js`)
   - Browser API availability
   - CSS feature support
   - Responsive design validation
   - Accessibility compliance

### Running Tests

#### Basic Test Execution
```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Test Output Example
```
Test Suites: 4 total
Tests:       41 total (39 passed, 2 failed)
Coverage:    85% statements, 82% branches, 88% functions, 85% lines
```

### Test Locations and Purpose

#### `/tests/setup.js`
- **Purpose**: Global test configuration and mocks
- **Key Features**:
  - Mock browser APIs (localStorage, sessionStorage, fetch)
  - Mock external libraries (Chart.js)
  - Global test utilities and helpers

#### `/tests/core-functionality.test.js`
- **Purpose**: Core application logic testing
- **Test Coverage**:
  - App initialization and module loading
  - State management operations
  - Question data handling
  - Timer and scoring logic

#### `/tests/button-functionality.test.js`
- **Purpose**: User interface interaction testing
- **Test Coverage**:
  - Click event handling
  - Form validations
  - Navigation controls
  - Modal and panel interactions

#### `/tests/performance.test.js`
- **Purpose**: Application performance validation
- **Test Coverage**:
  - DOM manipulation speed
  - Memory leak prevention
  - Component rendering efficiency
  - Data processing optimization

#### `/tests/cross-browser.test.js`
- **Purpose**: Browser compatibility verification
- **Test Coverage**:
  - Essential browser API support
  - CSS feature detection
  - Responsive design validation
  - Accessibility standards compliance

### Writing New Tests

#### Test Template
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
    document.body.innerHTML = '';
  });

  test('should perform expected behavior', () => {
    // Arrange
    const expectedValue = 'test';
    
    // Act
    const result = functionToTest(expectedValue);
    
    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

#### Mock Usage Examples
```javascript
// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock fetch requests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mock data' })
  })
);
```

### Continuous Integration

The test suite is designed to run in CI/CD environments with:
- Automated test execution on push/pull requests
- Coverage reporting
- Performance benchmarking
- Cross-browser testing support

## ⚡ Optimization Notes

### Recent Performance Improvements

#### Button Interaction Optimization
- **Event Delegation**: Implemented centralized click handling to reduce memory usage
- **Debouncing**: Added debounce logic for rapid button clicks
- **State Caching**: Optimized button state updates to minimize DOM queries

#### Rendering Performance
- **Batch DOM Updates**: Using `requestAnimationFrame` for smooth UI updates
- **Virtual Scrolling**: Efficient handling of large question lists
- **Component Lazy Loading**: Dynamic loading of HTML components to reduce initial bundle size

#### Memory Management
- **Cleanup Procedures**: Proper event listener removal and object disposal
- **Storage Optimization**: Efficient localStorage usage with data compression
- **Chart Optimization**: Reusing Chart.js instances instead of creating new ones

### Performance Metrics

#### Loading Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.0s
- **Time to Interactive**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

#### Runtime Performance
- **Question Navigation**: < 100ms response time
- **Result Calculation**: < 500ms for 100 questions
- **Chart Rendering**: < 300ms for complex datasets
- **Offline Sync**: < 200ms for data retrieval

### Future Optimization Opportunities

#### Code Splitting
```javascript
// Implement dynamic imports for large modules
const loadAdvancedFeatures = async () => {
  const { AdvancedAnalytics } = await import('./advanced-analytics.js');
  return new AdvancedAnalytics();
};
```

#### Service Worker Enhancements
- **Intelligent Caching**: Implement cache versioning and selective updates
- **Background Sync**: Queue operations when offline
- **Push Notifications**: Remind users of incomplete tests

#### Data Optimization
- **Question Preloading**: Predictive loading of likely next questions
- **Image Optimization**: WebP format support with fallbacks
- **JSON Compression**: Gzip compression for question data

#### Performance Monitoring
```javascript
// Add performance tracking
const trackPerformance = (label, startTime) => {
  const duration = performance.now() - startTime;
  if (duration > 100) {
    console.warn(`Performance warning: ${label} took ${duration}ms`);
  }
};
```

### Accessibility Improvements
- **Screen Reader Support**: Enhanced ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard accessibility for all interactions
- **High Contrast Mode**: Support for high contrast themes
- **Focus Management**: Proper focus handling during view transitions

## 🤝 Contributing Guidelines

We welcome contributions to improve the Units & Measurements Mock Test platform! Follow these guidelines to ensure a smooth collaboration process.

### Getting Started

#### 1. Fork the Repository
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/your-username/Units-measurements.git
cd Units-measurements
```

#### 2. Set Up Development Environment
```bash
# Install dependencies
npm install

# Create a new branch for your feature
git checkout -b feature/your-feature-name
```

### Development Process

#### Branch Naming Convention
- **Features**: `feature/description-of-feature`
- **Bug Fixes**: `bugfix/description-of-fix`
- **Documentation**: `docs/description-of-change`
- **Performance**: `perf/description-of-optimization`

#### Code Style Guidelines

##### JavaScript
- Use ES6+ modern syntax
- Follow existing code patterns and architecture
- Add JSDoc comments for public methods
- Maintain consistent indentation (2 spaces)
- Use meaningful variable and function names

```javascript
/**
 * Calculate test score based on correct answers
 * @param {Array} answers - User's answers
 * @param {Array} correctAnswers - Correct answer keys
 * @returns {Object} Score object with percentage and grade
 */
calculateScore(answers, correctAnswers) {
  // Implementation
}
```

##### CSS
- Follow BEM methodology for class naming
- Use CSS custom properties for theming
- Mobile-first responsive design
- Maintain consistent spacing and typography

```css
/* BEM Example */
.question-card {
  /* Block styles */
}

.question-card__title {
  /* Element styles */
}

.question-card--highlighted {
  /* Modifier styles */
}
```

##### HTML
- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Maintain consistent indentation
- Add descriptive comments for complex sections

### Testing Requirements

#### Before Submitting
```bash
# Run all tests
npm test

# Check code style
npm run lint

# Generate coverage report
npm run test:coverage
```

#### Test Coverage Requirements
- Minimum 80% code coverage for new features
- All existing tests must pass
- Add tests for bug fixes to prevent regression

#### Writing Tests
```javascript
// Example test structure
describe('New Feature', () => {
  test('should handle expected scenario', () => {
    // Arrange
    const input = 'test input';
    
    // Act
    const result = newFeature(input);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});
```

### Pull Request Process

#### 1. Prepare Your Changes
```bash
# Ensure your branch is up to date
git checkout main
git pull upstream main
git checkout feature/your-feature-name
git rebase main

# Run final checks
npm test
npm run lint
```

#### 2. Commit Guidelines
Use conventional commit messages:
```
type(scope): description

feat(timer): add pause functionality
fix(questions): resolve navigation bug
docs(readme): update installation guide
perf(charts): optimize rendering performance
```

#### 3. Submit Pull Request

##### PR Title Format
`Type: Brief description of changes`

##### PR Description Template
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors or warnings
```

### Code Review Process

#### Review Criteria
- **Functionality**: Does the code work as intended?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security concerns?
- **Maintainability**: Is the code clean and well-documented?
- **Testing**: Are tests comprehensive and meaningful?

#### Addressing Feedback
- Respond to all review comments
- Make requested changes in new commits
- Update tests if functionality changes
- Re-request review after addressing feedback

### Community Guidelines

#### Be Respectful
- Use inclusive language
- Provide constructive feedback
- Help newcomers get started
- Respect different perspectives

#### Communication
- Use clear, descriptive issue titles
- Provide detailed bug reports with reproduction steps
- Ask questions if requirements are unclear
- Update issues with your progress

### Issue Reporting

#### Bug Reports
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: [e.g., Chrome 95]
- OS: [e.g., Windows 10]
- Version: [e.g., 1.0.0]
```

#### Feature Requests
```markdown
**Feature Description**
A clear description of the desired feature.

**Use Case**
Why would this feature be useful?

**Proposed Solution**
How should this feature work?

**Additional Context**
Any other relevant information.
```

### Recognition

Contributors will be:
- Listed in the project contributors
- Mentioned in release notes for significant contributions
- Invited to become maintainers for consistent, quality contributions

Thank you for contributing to make this project better! 🚀

## 📄 License

MIT License

Copyright (c) 2024 RRB Mock Test Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/theprime007/Units-measurements/issues)
- **Discussions**: [GitHub Discussions](https://github.com/theprime007/Units-measurements/discussions)
- **Email**: [Contact the maintainer](mailto:support@rrb-mocktest.com)

## 🙏 Acknowledgments

- **Chart.js** - For excellent data visualization capabilities
- **Jest** - For comprehensive testing framework
- **Google Fonts** - For beautiful typography
- **Open Source Community** - For inspiration and best practices

---

**Made with ❤️ for RRB exam preparation**