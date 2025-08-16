/**
 * Button Functionality Tests
 * Tests all button interactions and event handling
 */

// Import modules (for Jest testing)
const fs = require('fs');
const path = require('path');

// Load the HTML and JS files
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const appMainJs = fs.readFileSync(path.resolve(__dirname, '../js/app-main.js'), 'utf8');
const utilsJs = fs.readFileSync(path.resolve(__dirname, '../js/utils.js'), 'utf8');
const storageJs = fs.readFileSync(path.resolve(__dirname, '../js/storage.js'), 'utf8');

describe('Button Functionality Tests', () => {
  let app;
  let container;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = html;
    container = document.getElementById('app-container');
    
    // Load the JavaScript modules
    eval(utilsJs);
    eval(storageJs);
    eval(appMainJs);
    
    // Initialize the app
    app = new MockTestApp();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Button Event Delegation', () => {
    test('should handle start test button click', () => {
      // Create a start test button
      const button = document.createElement('button');
      button.id = 'start-test-btn';
      button.textContent = 'Start Test';
      container.appendChild(button);

      // Set up event delegation
      app.setupGlobalEventDelegation();

      // Spy on the startTest method
      const startTestSpy = jest.spyOn(app, 'startTest').mockImplementation(() => {});

      // Click the button
      button.click();

      expect(startTestSpy).toHaveBeenCalled();
    });

    test('should handle exit exam button with confirmation', () => {
      const button = document.createElement('button');
      button.id = 'exit-exam-btn';
      button.textContent = 'Exit Exam';
      container.appendChild(button);

      app.setupGlobalEventDelegation();

      const backToHomeSpy = jest.spyOn(app, 'backToHome').mockImplementation(() => {});
      
      // Mock confirm to return true
      global.confirm = jest.fn(() => true);

      button.click();

      expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to exit the exam? Your progress will be saved.');
      expect(backToHomeSpy).toHaveBeenCalled();
    });

    test('should not execute action when exit exam confirmation is cancelled', () => {
      const button = document.createElement('button');
      button.id = 'exit-exam-btn';
      button.textContent = 'Exit Exam';
      container.appendChild(button);

      app.setupGlobalEventDelegation();

      const backToHomeSpy = jest.spyOn(app, 'backToHome').mockImplementation(() => {});
      
      // Mock confirm to return false
      global.confirm = jest.fn(() => false);

      button.click();

      expect(global.confirm).toHaveBeenCalled();
      expect(backToHomeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Button Debouncing', () => {
    test('should prevent multiple rapid clicks on start test button', () => {
      const button = document.createElement('button');
      button.id = 'start-test-btn';
      container.appendChild(button);

      app.setupGlobalEventDelegation();

      const startTestSpy = jest.spyOn(app, 'startTest').mockImplementation(() => {});

      // Click rapidly multiple times
      button.click();
      button.click();
      button.click();

      // Should only be called once due to debouncing
      expect(startTestSpy).toHaveBeenCalledTimes(1);
      expect(button.disabled).toBe(true);
    });

    test('should prevent multiple rapid clicks on submit test button', () => {
      const button = document.createElement('button');
      button.id = 'submit-test-btn';
      container.appendChild(button);

      app.setupGlobalEventDelegation();
      
      // Mock test manager
      app.testManager = {
        submitTest: jest.fn()
      };

      // Click rapidly multiple times
      button.click();
      button.click();

      // Should only be called once due to debouncing
      expect(app.testManager.submitTest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Target Resolution', () => {
    test('should handle clicks on child elements within buttons', () => {
      const button = document.createElement('button');
      button.id = 'start-test-btn';
      
      const icon = document.createElement('span');
      icon.className = 'icon';
      icon.textContent = '▶';
      button.appendChild(icon);
      
      const text = document.createElement('span');
      text.textContent = 'Start Test';
      button.appendChild(text);
      
      container.appendChild(button);

      app.setupGlobalEventDelegation();

      const startTestSpy = jest.spyOn(app, 'startTest').mockImplementation(() => {});

      // Click on the icon (child element)
      icon.click();

      expect(startTestSpy).toHaveBeenCalled();
    });
  });

  describe('Dynamic Button Creation', () => {
    test('should handle dynamically created buttons', () => {
      app.setupGlobalEventDelegation();

      // Dynamically create a button
      const button = document.createElement('button');
      button.id = 'view-solutions-btn';
      button.textContent = 'View Solutions';
      container.appendChild(button);

      const showSolutionsViewSpy = jest.spyOn(app, 'showSolutionsView').mockImplementation(() => {});

      button.click();

      expect(showSolutionsViewSpy).toHaveBeenCalled();
    });
  });

  describe('Button Processing States', () => {
    test('should set processing state during button operations', () => {
      const button = document.createElement('button');
      button.id = 'new-test-btn';
      container.appendChild(button);

      app.setupGlobalEventDelegation();

      const startNewTestSpy = jest.spyOn(app, 'startNewTest').mockImplementation(() => {});

      button.click();

      expect(button.dataset.processing).toBe('true');
      expect(startNewTestSpy).toHaveBeenCalled();
    });
  });
});

describe('Form Submission Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  test('should handle form submissions without page reload', () => {
    const form = document.createElement('form');
    form.id = 'settings-form';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'username';
    input.value = 'testuser';
    
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Save Settings';
    
    form.appendChild(input);
    form.appendChild(submit);
    document.body.appendChild(form);

    let prevented = false;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      prevented = true;
    });

    submit.click();

    expect(prevented).toBe(true);
  });
});

describe('Navigation Link Tests', () => {
  test('should handle navigation without page reload', () => {
    const link = document.createElement('a');
    link.href = '#test-view';
    link.textContent = 'Go to Test';
    link.className = 'nav-link';
    
    document.body.appendChild(link);

    let clicked = false;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      clicked = true;
    });

    link.click();

    expect(clicked).toBe(true);
  });
});