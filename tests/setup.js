// Jest setup file
require('@testing-library/jest-dom');

// Mock Chart.js
global.Chart = {
  register: jest.fn(),
  defaults: {
    responsive: true,
    maintainAspectRatio: false
  }
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock navigator
global.navigator = {
  serviceWorker: {
    register: jest.fn().mockResolvedValue({}),
  },
  onLine: true,
};

// Mock window.matchMedia
global.matchMedia = jest.fn(() => ({
  matches: false,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

// Mock confirm and alert
global.confirm = jest.fn(() => true);
global.alert = jest.fn();

// Mock fetch for component loading
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve('<div>Mock Component</div>'),
  })
);

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
  sessionStorageMock.getItem.mockReturnValue(null);
});