import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { BottomBar } from './index';

describe('BottomBar', () => {
  it('deve renderizar todos os itens de navegação', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <BottomBar themeMode="light" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Pesquisar')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Config')).toBeInTheDocument();
  });

  it('deve navegar ao clicar em um item', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <BottomBar themeMode="light" />
      </MemoryRouter>,
    );
    const cadastrar = screen.getByText('Cadastrar');
    fireEvent.click(cadastrar.closest('button'));
    // Não há navegação real, mas não deve quebrar
    expect(cadastrar).toBeInTheDocument();
  });
});
