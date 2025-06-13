import { render } from '@testing-library/react';

import { Centered } from './styles';

describe('Centered', () => {
  it('deve renderizar o conteúdo centralizado', () => {
    const { getByText } = render(<Centered>Conteúdo Centralizado</Centered>);
    expect(getByText('Conteúdo Centralizado')).toBeInTheDocument();
  });

  it('deve aceitar children múltiplos', () => {
    const { getByText } = render(
      <Centered>
        <span>Filho 1</span>
        <span>Filho 2</span>
      </Centered>,
    );
    expect(getByText('Filho 1')).toBeInTheDocument();
    expect(getByText('Filho 2')).toBeInTheDocument();
  });
});
