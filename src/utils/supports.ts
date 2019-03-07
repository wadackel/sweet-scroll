// @link https://github.com/JedWatson/exenv/blob/master/index.js
export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const canUseHistory = !canUseDOM
  ? false
  : window.history && 'pushState' in window.history && window.location.protocol !== 'file:';

export const canUsePassiveOption = (() => {
  let support = false;

  if (!canUseDOM) {
    return support;
  }

  /* tslint:disable:no-empty */
  try {
    const win = window;
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        support = true;
      },
    });

    win.addEventListener('test', null as any, opts);
    win.removeEventListener('test', null as any, opts);
  } catch (e) {}
  /* tslint:enable */

  return support;
})();
