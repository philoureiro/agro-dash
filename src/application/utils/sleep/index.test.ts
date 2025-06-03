import { describe, expect, it } from 'vitest';

import { sleep } from './index';

describe('sleep', () => {
  it('should resolve after at least the specified milliseconds', async () => {
    const start = Date.now();
    await sleep(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  it('should return a Promise', () => {
    const result = sleep(50);
    expect(result).toBeInstanceOf(Promise);
  });
});
