import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Toast } from './index';

describe('Toast', () => {
  const baseData = {
    id: '1',
    type: 'success',
    title: 'Sucesso',
    message: 'Mensagem de sucesso',
    duration: 1000,
  };
  const onRemove = vi.fn();

  it('deve renderizar o título e mensagem', () => {
    render(<Toast data={baseData} position="top-right" onRemove={onRemove} />);
    expect(screen.getByText('Sucesso')).toBeInTheDocument();
    expect(screen.getByText('Mensagem de sucesso')).toBeInTheDocument();
  });

  it('deve renderizar o ícone correto para cada tipo', () => {
    const types = [
      { type: 'success', icon: '✅' },
      { type: 'error', icon: '❌' },
      { type: 'warning', icon: '⚠️' },
      { type: 'info', icon: 'ℹ️' },
    ];
    types.forEach(({ type, icon }) => {
      render(<Toast data={{ ...baseData, type }} position="top-right" onRemove={onRemove} />);
      expect(screen.getByText(icon)).toBeInTheDocument();
    });
  });

  it('deve chamar ação customizada se fornecida', () => {
    const action = { label: 'Ação', onClick: vi.fn() };
    render(<Toast data={{ ...baseData, action }} position="top-right" onRemove={onRemove} />);
    fireEvent.click(screen.getByText('Ação'));
    expect(action.onClick).toHaveBeenCalled();
  });
});
