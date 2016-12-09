// @link https://github.com/JedWatson/exenv/blob/master/index.js
export const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

// @link https://github.com/Modernizr/Modernizr
export const history = (() => {
  if (!canUseDOM) return false;

  const ua = navigator.userAgent;
  if (
    (ua.indexOf("Android 2.") !== -1 ||
    (ua.indexOf("Android 4.0") !== -1)) &&
    ua.indexOf("Mobile Safari") !== -1 &&
    ua.indexOf("Chrome") === -1 &&
    ua.indexOf("Windows Phone") === -1
  ) {
    return false;
  }

  return (
    window.history &&
    "pushState" in window.history &&
    window.location.protocol !== "file:"
  );
})();
