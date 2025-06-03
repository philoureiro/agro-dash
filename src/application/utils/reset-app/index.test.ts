import { describe, expect, it, vi } from 'vitest';

import { resetApp } from './index';

describe('resetApp', () => {
  it('should call window.location.reload', () => {
    const reloadMock = vi.fn();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { reload: reloadMock };

    resetApp();

    expect(reloadMock).toHaveBeenCalled();
  });
});
