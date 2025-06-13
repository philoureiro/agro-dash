import { render, screen } from '@testing-library/react';

import { PhotoPreview } from './index';

describe('PhotoPreview', () => {
  it('deve renderizar o placeholder correto para cada tipo', () => {
    render(<PhotoPreview photoUrl={undefined} isDark={false} type="producer" />);
    expect(screen.getByText('Foto do Produtor')).toBeInTheDocument();
    render(<PhotoPreview photoUrl={undefined} isDark={false} type="farm" />);
    expect(screen.getByText('Foto da Fazenda')).toBeInTheDocument();
    render(<PhotoPreview photoUrl={undefined} isDark={false} type="crop" />);
    expect(screen.getByText('Foto da Cultura')).toBeInTheDocument();
  });

  it('deve renderizar a imagem quando photoUrl é fornecida', () => {
    render(
      <PhotoPreview photoUrl="https://via.placeholder.com/150" isDark={false} type="producer" />,
    );
    expect(screen.getByAltText('Foto do Produtor')).toBeInTheDocument();
  });

  it('deve renderizar overlay e label quando há foto', () => {
    render(<PhotoPreview photoUrl="https://via.placeholder.com/150" isDark={true} type="farm" />);
    expect(screen.getByText('🏭 Foto da Fazenda')).toBeInTheDocument();
  });
});
