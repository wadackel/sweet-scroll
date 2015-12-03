export function easeInQuint(x, t, b, c, d) {
  return c * (t /= d) * t * t * t + b;
}

export function easeOutQuint(x, t, b, c, d) {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
}

export function easeInOutQuint(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t * t + b;
  }
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}