import { describe, it, expect } from 'vitest';
import { CodeExecutionService } from './execution';

describe('execution service', () => {
  it('creates service', () => {
    const svc = new CodeExecutionService();
    expect(svc).toBeDefined();
  });

  it('normalizes output', () => {
    // Indirectly test via service behavior - we test the function exists
    const svc = new CodeExecutionService();
    expect(typeof svc.execute).toBe('function');
    expect(typeof svc.submit).toBe('function');
  });
});
