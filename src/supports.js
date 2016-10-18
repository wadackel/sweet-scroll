import { win } from "./elements";

// @link https://github.com/Modernizr/Modernizr
export const history = (() => {
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

  return (win.history && "pushState" in win.history && win.location.protocol !== "file:");
})();
