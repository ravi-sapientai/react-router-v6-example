import { describe, it, expect, jest } from '@jest/globals';

// Mock the web-vitals module
jest.mock('web-vitals', () => ({
  getCLS: () => {},
  getFID: () => {},
  getFCP: () => {},
  getLCP: () => {},
  getTTFB: () => {},
}));

// Import the function to be tested
import reportWebVitals from '../../src/reportWebVitals';

describe('reportWebVitals', () => {
  let webVitals;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetModules();
    webVitals = require('web-vitals');
    Object.keys(webVitals).forEach(key => {
      webVitals[key] = jest.fn();
    });
  });

  it('should call all web vitals functions when onPerfEntry is a valid function', () => {
    const mockOnPerfEntry = jest.fn();
    reportWebVitals(mockOnPerfEntry);

    expect(webVitals.getCLS).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(webVitals.getFID).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(webVitals.getFCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(webVitals.getLCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(webVitals.getTTFB).toHaveBeenCalledWith(mockOnPerfEntry);
  });

  it('should not call any web vitals functions when onPerfEntry is not provided', () => {
    reportWebVitals();

    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });

  it('should not call any web vitals functions when onPerfEntry is not a function', () => {
    reportWebVitals({});

    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });

  it('should handle errors when importing web-vitals module', () => {
    jest.doMock('web-vitals', () => {
      throw new Error('Failed to import web-vitals');
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockOnPerfEntry = jest.fn();

    reportWebVitals(mockOnPerfEntry);

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(mockOnPerfEntry).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});