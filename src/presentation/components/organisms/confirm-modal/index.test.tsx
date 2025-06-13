import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ConfirmModal } from './index';

describe('ConfirmModal', () => {
  const baseProps = {
    isVisible: true,
    isDark: false,
    title: 'Título',
    message: 'Mensagem',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('deve renderizar o título e mensagem', () => {
    render(<ConfirmModal {...baseProps} />);
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Mensagem')).toBeInTheDocument();
  });

  it('deve renderizar o subtítulo se fornecido', () => {
    render(<ConfirmModal {...baseProps} subtitle="Subtítulo" />);
    expect(screen.getByText('Subtítulo')).toBeInTheDocument();
  });

  it('deve chamar onConfirm ao clicar no botão de confirmar', () => {
    render(<ConfirmModal {...baseProps} />);
    fireEvent.click(screen.getByText(/Confirmar|Excluir|Continuar|OK/));
    expect(baseProps.onConfirm).toHaveBeenCalled();
  });

  it('deve chamar onCancel ao clicar no botão de cancelar', () => {
    render(<ConfirmModal {...baseProps} />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(baseProps.onCancel).toHaveBeenCalled();
  });

  it('deve renderizar diferentes tipos de modal', () => {
    render(<ConfirmModal {...baseProps} type="danger" />);
    expect(screen.getByText('Excluir')).toBeInTheDocument();
    render(<ConfirmModal {...baseProps} type="warning" />);
    expect(screen.getByText('Continuar')).toBeInTheDocument();
    render(<ConfirmModal {...baseProps} type="info" />);
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('não renderiza nada se isVisible for false', () => {
    const { container } = render(<ConfirmModal {...baseProps} isVisible={false} />);
    expect(container.firstChild).toBeNull();
  });
});
