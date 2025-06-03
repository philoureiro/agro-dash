import { Loading } from '@components';
import { describe, expect, it, vi } from 'vitest';

import configuredAsyncComponentLoader, { loaderDefaultOptions } from './index';
import { asyncComponentLoader } from './loader';

vi.mock('./loader', () => ({
  asyncComponentLoader: vi.fn(),
}));
vi.mock('@components', () => ({
  Loading: () => <div>Loading...</div>,
}));
vi.mock('@config', () => ({
  loader: { timeout: 5000 },
}));

describe('configuredAsyncComponentLoader', () => {
  const mockLoadComponent = vi.fn();
  const mockAdditionalProps = { foo: 'bar' };
  const mockLoaderOptions = { timeout: 1000 };
  const MockFallback = () => <div>Fallback</div>;

  it('calls asyncComponentLoader with default options and Loading fallback', () => {
    configuredAsyncComponentLoader(mockLoadComponent, mockAdditionalProps);

    expect(asyncComponentLoader).toHaveBeenCalledWith(
      mockLoadComponent,
      mockAdditionalProps,
      loaderDefaultOptions,
      Loading,
    );
  });

  it('calls asyncComponentLoader with custom loaderOptions and Fallback', () => {
    configuredAsyncComponentLoader(
      mockLoadComponent,
      mockAdditionalProps,
      mockLoaderOptions,
      MockFallback,
    );

    expect(asyncComponentLoader).toHaveBeenCalledWith(
      mockLoadComponent,
      mockAdditionalProps,
      mockLoaderOptions,
      MockFallback,
    );
  });

  it('exports loaderDefaultOptions', () => {
    expect(loaderDefaultOptions).toBeDefined();
    expect(typeof loaderDefaultOptions).toBe('object');
  });

  it('exports configuredAsyncComponentLoader as default', () => {
    expect(configuredAsyncComponentLoader).toBeDefined();
  });
});
