import { describe, expect, it, vi } from 'vitest';

import { welcome } from './index';

// Mock do título
vi.mock('@config', () => ({
  title: 'Meu Projeto Blaster',
}));

describe('welcome', () => {
  it('deve dar um console.log com o título correto', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    welcome();

    // Usa expressão regular pra ser flexível quanto à cor aleatória
    expect(spy).toHaveBeenCalledTimes(1);
    const args = spy.mock.calls[0];
    expect(args[0]).toMatch(/=== Meu Projeto Blaster ===/);
    expect(args[0]).toContain('%c'); // deve usar estilização
    expect(typeof args[1]).toBe('string'); // estilos CSS
    expect(args[1]).toContain('color: rgb');
    expect(args[1]).toContain('background-color: rgb');

    spy.mockRestore();
  });
});
