import { act, renderHook } from '@testing-library/react';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { useOrientation } from './index';

describe('useOrientation', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // Reset window size before each test
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 600,
    });
  });

  afterAll(() => {
    // Restore original window size after all tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('should return false when in landscape mode', () => {
    Object.defineProperty(window, 'innerWidth', { value: 800 });
    Object.defineProperty(window, 'innerHeight', { value: 600 });
    const { result } = renderHook(() => useOrientation());
    expect(result.current).toBe(false);
  });

  it('should return true when in portrait mode', () => {
    Object.defineProperty(window, 'innerWidth', { value: 600 });
    Object.defineProperty(window, 'innerHeight', { value: 800 });
    const { result } = renderHook(() => useOrientation());
    expect(result.current).toBe(true);
  });

  it('should update when orientation changes', () => {
    Object.defineProperty(window, 'innerWidth', { value: 800 });
    Object.defineProperty(window, 'innerHeight', { value: 600 });
    const { result } = renderHook(() => useOrientation());

    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 600 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(true);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 900 });
      Object.defineProperty(window, 'innerHeight', { value: 400 });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(false);
  });
});
