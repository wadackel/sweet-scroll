/* eslint-disable no-param-reassign, newline-before-return, max-params, new-cap */
import * as math from "./math";


export function linear(p) {
  return p;
}

export function InQuad(x, t, b, c, d) {
  return c * (t /= d) * t + b;
}

export function OutQuad(x, t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
}

export function InOutQuad(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t + b;
  }
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

export function InCubic(x, t, b, c, d) {
  return c * (t /= d) * t * t + b;
}

export function OutCubic(x, t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

export function InOutCubic(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t + b;
  }
  return c / 2 * ((t -= 2) * t * t + 2) + b;
}

export function InQuart(x, t, b, c, d) {
  return c * (t /= d) * t * t * t + b;
}

export function OutQuart(x, t, b, c, d) {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
}

export function InOutQuart(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t * t + b;
  }
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}

export function InQuint(x, t, b, c, d) {
  return c * (t /= d) * t * t * t * t + b;
}

export function OutQuint(x, t, b, c, d) {
  return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
}

export function InOutQuint(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t * t * t + b;
  }
  return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}

export function InSine(x, t, b, c, d) {
  return -c * math.cos(t / d * (math.PI / 2)) + c + b;
}

export function OutSine(x, t, b, c, d) {
  return c * math.sin(t / d * (math.PI / 2)) + b;
}

export function InOutSine(x, t, b, c, d) {
  return -c / 2 * (math.cos(math.PI * t / d) - 1) + b;
}

export function InExpo(x, t, b, c, d) {
  return (t === 0) ? b : c * math.pow(2, 10 * (t / d - 1)) + b;
}

export function OutExpo(x, t, b, c, d) {
  return (t === d) ? b + c : c * (-math.pow(2, -10 * t / d) + 1) + b;
}

export function InOutExpo(x, t, b, c, d) {
  if (t === 0) return b;
  if (t === d) return b + c;
  if ((t /= d / 2) < 1) return c / 2 * math.pow(2, 10 * (t - 1)) + b;
  return c / 2 * (-math.pow(2, -10 * --t) + 2) + b;
}

export function InCirc(x, t, b, c, d) {
  return -c * (math.sqrt(1 - (t /= d) * t) - 1) + b;
}

export function OutCirc(x, t, b, c, d) {
  return c * math.sqrt(1 - (t = t / d - 1) * t) + b;
}

export function InOutCirc(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return -c / 2 * (math.sqrt(1 - t * t) - 1) + b;
  }
  return c / 2 * (math.sqrt(1 - (t -= 2) * t) + 1) + b;
}

export function InElastic(x, t, b, c, d) {
  let s = 1.70158;
  let p = 0;
  let a = c;
  if (t === 0) return b;
  if ((t /= d) === 1) return b + c;
  if (!p) p = d * .3;
  if (a < math.abs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = p / (2 * math.PI) * math.asin(c / a);
  }
  return -(a * math.pow(2, 10 * (t -= 1)) * math.sin((t * d - s) * (2 * math.PI) / p)) + b;
}

export function OutElastic(x, t, b, c, d) {
  let s = 1.70158;
  let p = 0;
  let a = c;
  if (t === 0) return b;
  if ((t /= d) === 1) return b + c;
  if (!p) p = d * .3;
  if (a < math.abs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = p / (2 * math.PI) * math.asin(c / a);
  }
  return a * math.pow(2, -10 * t) * math.sin((t * d - s) * (2 * math.PI) / p) + c + b;
}

export function InOutElastic(x, t, b, c, d) {
  let s = 1.70158;
  let p = 0;
  let a = c;
  if (t === 0) return b;
  if ((t /= d / 2) === 2) return b + c;
  if (!p) p = d * (.3 * 1.5);
  if (a < math.abs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = p / (2 * math.PI) * math.asin(c / a);
  }
  if (t < 1) {
    return -.5 * (a * math.pow(2, 10 * (t -= 1)) * math.sin((t * d - s) * (2 * math.PI) / p)) + b;
  }
  return a * math.pow(2, -10 * (t -= 1)) * math.sin((t * d - s) * (2 * math.PI) / p) * .5 + c + b;
}

export function InBack(x, t, b, c, d, s = 1.70158) {
  return c * (t /= d) * t * ((s + 1) * t - s) + b;
}

export function OutBack(x, t, b, c, d, s = 1.70158) {
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
}

export function InOutBack(x, t, b, c, d, s = 1.70158) {
  if ((t /= d / 2) < 1) {
    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
  }
  return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}

export function OutBounce(x, t, b, c, d) {
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

export function InBounce(x, t, b, c, d) {
  return c - OutBounce(x, d - t, 0, c, d) + b;
}

export function InOutBounce(x, t, b, c, d) {
  if (t < d / 2) {
    return InBounce(x, t * 2, 0, c, d) * .5 + b;
  }
  return OutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
}
