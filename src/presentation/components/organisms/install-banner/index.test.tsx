import { usePWAInstallPrompt } from '@hooks';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { InstallBanner } from './index';

// Mock do hook
vi.mock('@hooks', () => ({
  usePWAInstallPrompt: vi.fn(),
}));

describe('InstallBanner', () => {
  beforeEach(() => {
    vi.spyOn(window, 'navigator', 'get').mockReturnValue({
      userAgent: 'iphone',
      standalone: false,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve renderizar o banner iOS quando não está instalado', () => {
    (usePWAInstallPrompt as any).mockReturnValue({ deferredPrompt: null, isInstalled: false });
    render(<InstallBanner />);
    expect(screen.getByText(/Para instalar o app/)).toBeInTheDocument();
  });

  it('não renderiza nada se já estiver instalado', () => {
    (usePWAInstallPrompt as any).mockReturnValue({ deferredPrompt: null, isInstalled: true });
    const { container } = render(<InstallBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('fecha o banner ao clicar no botão de fechar', () => {
    (usePWAInstallPrompt as any).mockReturnValue({ deferredPrompt: {}, isInstalled: false });
    render(<InstallBanner />);
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    expect(screen.queryByText(/Adicione o AgroDash à tela inicial/)).not.toBeInTheDocument();
  });
});
