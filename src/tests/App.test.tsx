
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Basic smoke test to ensure the app renders without crashing
describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    // If the app renders without crashing, this test passes
    expect(document.body).toBeDefined();
  });
});
