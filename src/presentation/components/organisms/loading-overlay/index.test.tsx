import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { LoadingOverlay } from './index';

describe('LoadingOverlay', () => {
  it('deve renderizar o overlay quando isVisible for true', () => {
    render(<LoadingOverlay isVisible isDark={false} />);
    expect(screen.getByText(/Processando dados/)).toBeInTheDocument();
  });

  it('não renderiza nada quando isVisible for false', () => {
    const { container } = render(<LoadingOverlay isVisible={false} isDark={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar barra de progresso quando showProgress for true', () => {
    render(<LoadingOverlay isVisible isDark={false} showProgress progress={50} />);
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('deve renderizar stats quando fornecido', () => {
    render(<LoadingOverlay isVisible isDark={false} stats={[{ label: 'Testes', value: 10 }]} />);
    expect(screen.getByText('Testes')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('deve chamar onCancel ao clicar no botão de cancelar', () => {
    const onCancel = vi.fn();
    render(<LoadingOverlay isVisible isDark={false} cancelable onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalled();
  });
});
