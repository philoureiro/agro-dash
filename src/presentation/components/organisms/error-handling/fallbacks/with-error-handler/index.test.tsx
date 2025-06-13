import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import WithErrorHandler from './index';

// Componente de teste
const TestComponent = () => <div>Test Component</div>;

// Fallback de teste
const TestFallback = () => <div>Error Fallback</div>;

describe('WithErrorHandler', () => {
  it('deve renderizar o componente normalmente quando não há erro', () => {
    const WrappedComponent = WithErrorHandler(TestComponent, TestFallback);
    render(<WrappedComponent />);

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('deve renderizar o fallback quando ocorre um erro', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    const WrappedComponent = WithErrorHandler(ErrorComponent, TestFallback);

    // Suprime o erro no console durante o teste
    const consoleError = console.error;
    console.error = vi.fn();

    render(<WrappedComponent />);

    expect(screen.getByText('Error Fallback')).toBeInTheDocument();

    // Restaura o console.error
    console.error = consoleError;
  });

  it('deve manter o displayName do componente original', () => {
    const WrappedComponent = WithErrorHandler(TestComponent, TestFallback);
    expect(WrappedComponent.displayName).toBe('WithErrorHandlingTestComponent');
  });
});
