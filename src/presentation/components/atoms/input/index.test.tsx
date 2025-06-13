import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Input } from './index';

describe('Input Component', () => {
  const defaultProps = {
    label: 'Teste',
    value: '',
    onChange: vi.fn(),
    isDark: false,
  };

  it('deve renderizar o input com label', () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByLabelText('Teste')).toBeInTheDocument();
  });

  it('deve chamar onChange quando o valor é alterado', () => {
    render(<Input {...defaultProps} />);
    const input = screen.getByLabelText('Teste');
    fireEvent.change(input, { target: { value: 'novo valor' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith('novo valor');
  });

  it('deve mostrar mensagem de validação quando fornecida', () => {
    render(
      <Input {...defaultProps} validationMessage="Campo obrigatório" validationType="error" />,
    );
    const input = screen.getByLabelText('Teste');
    fireEvent.focus(input);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('deve renderizar select quando options são fornecidas', () => {
    const options = [
      { value: '1', label: 'Opção 1' },
      { value: '2', label: 'Opção 2' },
    ];
    render(<Input {...defaultProps} options={options} />);
    expect(screen.getByText('Opção 1')).toBeInTheDocument();
    expect(screen.getByText('Opção 2')).toBeInTheDocument();
  });

  it('deve renderizar textarea quando multiline é true', () => {
    render(<Input {...defaultProps} multiline rows={4} />);
    const textarea = screen.getByLabelText('Teste');
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('deve mostrar ícone de validação quando valid é fornecido', () => {
    render(<Input {...defaultProps} valid={true} />);
    const input = screen.getByLabelText('Teste');
    fireEvent.change(input, { target: { value: 'teste' } });
    expect(screen.getByTestId('validation-icon')).toBeInTheDocument();
  });

  it('deve aplicar estilo dark quando isDark é true', () => {
    render(<Input {...defaultProps} isDark={true} />);
    const input = screen.getByLabelText('Teste');
    expect(input).toHaveStyle({ color: '#ffffff' });
  });

  it('deve desabilitar o input quando disabled é true', () => {
    render(<Input {...defaultProps} disabled />);
    const input = screen.getByLabelText('Teste');
    expect(input).toBeDisabled();
  });

  it('deve mostrar asterisco quando required é true', () => {
    render(<Input {...defaultProps} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('deve aceitar e aplicar placeholder', () => {
    render(<Input {...defaultProps} placeholder="Digite algo" />);
    const input = screen.getByLabelText('Teste');
    expect(input).toHaveAttribute('placeholder', 'Digite algo');
  });
});
