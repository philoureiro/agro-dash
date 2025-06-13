import { render, screen } from '@testing-library/react';

import { Text } from './index';

describe('Text Component', () => {
  it('deve renderizar o texto corretamente', () => {
    render(<Text>Texto de teste</Text>);
    expect(screen.getByText('Texto de teste')).toBeInTheDocument();
  });

  it('deve aplicar o estilo itálico quando solicitado', () => {
    render(<Text italic>Texto em itálico</Text>);
    const text = screen.getByText('Texto em itálico');
    expect(text).toHaveStyle({ 'font-style': 'italic' });
  });

  it('deve aceitar e aplicar props adicionais do Typography', () => {
    render(<Text variant="h1">Título</Text>);
    const text = screen.getByText('Título');
    expect(text.tagName.toLowerCase()).toBe('h1');
  });
});
