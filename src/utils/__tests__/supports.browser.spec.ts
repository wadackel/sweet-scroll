import { canUseDOM } from '../supports';

describe('Supports', () => {
  it('Should be return true', () => {
    expect(canUseDOM).toBe(true);
  });
});
