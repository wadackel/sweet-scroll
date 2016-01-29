const mathCos = Math.cos;
const mathSin = Math.sin;
const mathPow = Math.pow;
const mathAbs = Math.abs;
const mathSqrt = Math.sqrt;
const mathAsin = Math.asin;
const PI = Math.PI;


export function linear(p) {
  return p;
}

export function easeInQuad(x, t, b, c, d) {
  return c * (t /= d) * t + b;
}

export function easeOutQuad(x, t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
}

export function easeInOutQuad(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t + b;
  }
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

export function easeInCubic(x, t, b, c, d) {
  return c * (t /= d) * t * t + b;
}

export function easeOutCubic(x, t, b, c, d) {
  return c * ((t=t / d - 1) * t * t + 1) + b;
}

export function easeInOutCubic(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t + b;
  }
  return c / 2 * ((t -= 2) * t * t + 2) + b;
}

export function easeInQuart(x, t, b, c, d) {
  return c * (t /= d) * t * t * t + b;
}

export function easeOutQuart(x, t, b, c, d) {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
}

export function easeInOutQuart(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t * t + b;
  }
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}

export function easeInQuint(x, t, b, c, d) {
  return c * (t /= d) * t * t * t * t + b;
}

export function easeOutQuint(x, t, b, c, d) {
  return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
}

export function easeInOutQuint(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t * t * t + b;
  }
  return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}

export function easeInSine(x, t, b, c, d) {
  return -c * mathCos(t / d * (PI / 2)) + c + b;
}

export function easeOutSine(x, t, b, c, d) {
  return c * mathSin(t / d * (PI / 2)) + b;
}

export function easeInOutSine(x, t, b, c, d) {
  return -c / 2 * (mathCos(PI * t / d) - 1) + b;
}

export function easeInExpo(x, t, b, c, d) {
  return (t === 0) ? b : c * mathPow(2, 10 * (t / d - 1)) + b;
}

export function easeOutExpo(x, t, b, c, d) {
  return (t === d) ? b + c : c * (-mathPow(2, -10 * t / d) + 1) + b;
}

export function easeInOutExpo(x, t, b, c, d) {
  if (t === 0) return b;
  if (t === d) return b + c;
  if ((t /= d / 2) < 1) return c / 2 * mathPow(2, 10 * (t - 1)) + b;
  return c / 2 * (-mathPow(2, -10 * --t) + 2) + b;
}

export function easeInCirc(x, t, b, c, d) {
  return -c * (mathSqrt(1 - (t /= d) * t) - 1) + b;
}

export function easeOutCirc(x, t, b, c, d) {
  return c * mathSqrt(1 - (t = t / d - 1) * t) + b;
}

export function easeInOutCirc(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return -c / 2 * (mathSqrt(1 - t * t) - 1) + b;
  }
  return c / 2 * (mathSqrt(1 - (t -= 2) * t) + 1) + b;
}

export function easeInElastic(x, t, b, c, d) {
  let s = 1.70158, p = 0, a = c;
  if (t === 0) return b;
  if ((t /= d) === 1) return b + c;
  if (!p) p = d *.3;
  if (a < mathAbs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = p / (2 * PI) * mathAsin(c / a);
  }
  return -(a * mathPow(2, 10 * (t -= 1)) * mathSin((t * d - s) * (2 * PI) / p)) + b;
}

export function easeOutElastic(x, t, b, c, d) {
  let s = 1.70158, p = 0, a = c;
  if (t === 0) return b;
  if ((t /= d) === 1) return b + c;
  if (!p) p = d * .3;
  if (a < mathAbs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = p / (2 * PI) * mathAsin(c / a);
  }
  return a * mathPow(2, -10 * t) * mathSin((t * d - s) * (2 * PI) / p) + c + b;
}

export function easeInOutElastic(x, t, b, c, d) {
  let s = 1.70158, p = 0, a = c;
  if (t === 0) return b;
  if ((t /= d / 2) === 2) return b + c;
  if (!p) p = d * (.3 * 1.5);
  if (a < mathAbs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = p / (2 * PI) * mathAsin(c / a);
  }
  if (t < 1) {
    return -.5 * (a * mathPow(2, 10 * (t -= 1)) * mathSin((t * d - s) * (2 * PI) / p)) + b;
  }
  return a * mathPow(2, -10 * (t -= 1)) * mathSin((t * d - s) * (2 * PI) / p) * .5 + c + b;
}

export function easeInBack(x, t, b, c, d, s = 1.70158) {
  return c * (t /= d) * t * ((s + 1) * t - s) + b;
}

export function easeOutBack(x, t, b, c, d, s = 1.70158) {
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
}

export function easeInOutBack(x, t, b, c, d, s = 1.70158) {
  if ((t /= d / 2) < 1) {
    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
  }
  return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}

export function easeInBounce(x, t, b, c, d) {
  return c - easeOutBounce(x, d - t, 0, c, d) + b;
}

export function easeOutBounce(x, t, b, c, d) {
  if ((t /= d) < (1 / 2.75)) {
    return c * (7.5625 * t * t) + b;
  } else if (t < (2 / 2.75)) {
    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
  } else if (t < (2.5 / 2.75)) {
    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
  } else {
    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
  }
}

export function easeInOutBounce(x, t, b, c, d) {
  if (t < d / 2) {
    return easeInBounce(x, t * 2, 0, c, d) * .5 + b;
  }
  return easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
}