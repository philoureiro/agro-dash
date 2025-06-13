import { FiCheck, FiPlus } from 'react-icons/fi';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Button } from './index';

describe('Button Component', () => {
  it('deve renderizar o botão com texto', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('deve renderizar o botão com ícone inicial', () => {
    render(<Button startIcon={<FiPlus />}>Adicionar</Button>);
    expect(screen.getByText('Adicionar')).toBeInTheDocument();
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('deve renderizar o botão com ícone final', () => {
    render(<Button endIcon={<FiCheck />}>Confirmar</Button>);
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('deve renderizar o botão com ícones inicial e final', () => {
    render(
      <Button startIcon={<FiPlus />} endIcon={<FiCheck />}>
        Adicionar e Confirmar
      </Button>,
    );
    expect(screen.getByText('Adicionar e Confirmar')).toBeInTheDocument();
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('deve renderizar o botão desabilitado', () => {
    render(<Button disabled>Botão Desabilitado</Button>);
    const button = screen.getByText('Botão Desabilitado');
    expect(button).toBeDisabled();
  });

  it('deve aceitar a prop isDark sem quebrar', () => {
    render(<Button isDark={true}>Botão Escuro</Button>);
    expect(screen.getByText('Botão Escuro')).toBeInTheDocument();
  });

  it('deve aceitar a prop gradient sem quebrar', () => {
    render(<Button gradient={true}>Botão Gradiente</Button>);
    expect(screen.getByText('Botão Gradiente')).toBeInTheDocument();
  });

  it('deve aceitar a prop size', () => {
    render(<Button size="small">Botão Pequeno</Button>);
    expect(screen.getByText('Botão Pequeno')).toBeInTheDocument();
  });

  it('deve aceitar a prop color', () => {
    render(<Button color="primary">Botão Primário</Button>);
    expect(screen.getByText('Botão Primário')).toBeInTheDocument();
  });
});
