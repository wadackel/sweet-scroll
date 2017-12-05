import { canUseDOM } from '../supports';

describe('Supports', () => {
  it('Should be return false', () => {
    expect(canUseDOM).toBe(false);
  });
});
