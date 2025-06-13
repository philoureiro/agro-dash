import { render, screen } from '@testing-library/react';

import { StatsHeader } from './index';

describe('StatsHeader', () => {
  const stats = [
    { label: 'Produtores', value: 5 },
    { label: 'Fazendas', value: 10 },
  ];

  it('deve renderizar os stats corretamente', () => {
    render(<StatsHeader progress={60} stats={stats} isDark={false} />);
    expect(screen.getByText('Produtores')).toBeInTheDocument();
    expect(screen.getByText('Fazendas')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('deve renderizar a barra de progresso', () => {
    render(<StatsHeader progress={80} stats={[]} isDark={true} progressLabel="Progresso" />);
    expect(screen.getByText('Progresso')).toBeInTheDocument();
  });

  it('deve renderizar a imagem de fundo se fornecida', () => {
    render(
      <StatsHeader
        progress={50}
        stats={[]}
        isDark={false}
        backgroundImage="https://via.placeholder.com/300"
      />,
    );
    expect(screen.getByAltText('Background')).toBeInTheDocument();
  });
});
