// @link https://github.com/JedWatson/exenv/blob/master/index.js
export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const canUseHistory = !canUseDOM
  ? false
  : (
    window.history &&
    'pushState' in window.history &&
    window.location.protocol !== 'file:'
  );

export const canUsePassiveOption = (() => {
  let support = false;

  if (!canUseDOM) {
    return support;
  }

  /* tslint:disable:no-empty */
  try {
    window.addEventListener('test', (null as any), Object.defineProperty({}, 'passive', {
      get() {
        support = true;
      },
    }));
  } catch (e) {}
  /* tslint:enable */

  return support;
})();
