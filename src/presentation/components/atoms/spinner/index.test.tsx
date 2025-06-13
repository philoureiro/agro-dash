import { render, screen } from '@testing-library/react';

import { SpinnerComponent } from './index';

describe('SpinnerComponent', () => {
  it('deve renderizar o spinner corretamente', () => {
    render(<SpinnerComponent />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('deve ter a animação de rotação', () => {
    render(<SpinnerComponent />);
    const spinner = screen.getByTestId('spinner');
    const style = window.getComputedStyle(spinner);
    expect(style.animation).toContain('1s linear infinite');
  });
});
