
// Add any global test configuration here
import '@testing-library/jest-dom';

// Mock the window.matchMedia function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: function() {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() {},
    };
  }
});
