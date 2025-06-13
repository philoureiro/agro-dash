import { render, screen } from '@testing-library/react';

import LoaderErrorBoundaryFallback from './index';

describe('LoaderErrorBoundaryFallback', () => {
  it('deve renderizar a mensagem de erro do loader', () => {
    render(<LoaderErrorBoundaryFallback />);

    expect(
      screen.getByText(/Something went wrong with this component loading process/),
    ).toBeInTheDocument();
  });

  it('deve ter a classe correta do Typography', () => {
    render(<LoaderErrorBoundaryFallback />);

    const errorMessage = screen.getByText(
      /Something went wrong with this component loading process/,
    );
    expect(errorMessage).toHaveClass('MuiTypography-h5');
  });
});
