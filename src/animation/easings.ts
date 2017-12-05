/* tslint:disable:curly */
/* tslint:disable:no-conditional-assignment */
const { cos, sin, pow, sqrt, PI } = Math;

export interface EasingFunction {
  (x: number, t: number, b: number, c: number, d: number, s?: number): number;
}

export interface Easings {
  [name: string]: EasingFunction;
}

export const easings: Easings = {
  linear: (p) => p,

  easeInQuad: (_, t, b, c, d) => (
    c * (t /= d) * t + b
  ),

  easeOutQuad: (_, t, b, c, d) => (
    -c * (t /= d) * (t - 2) + b
  ),

  easeInOutQuad: (_, t, b, c, d) => (
    (t /= d / 2) < 1 ? c / 2 * t * t + b : -c / 2 * ((--t) * (t - 2) - 1) + b
  ),

  easeInCubic: (_, t, b, c, d) => (
    c * (t /= d) * t * t + b
  ),

  easeOutCubic: (_, t, b, c, d) => (
    c * ((t = t / d - 1) * t * t + 1) + b
  ),

  easeInOutCubic: (_, t, b, c, d) => (
    (t /= d / 2) < 1 ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b
  ),

  easeInQuart: (_, t, b, c, d) => (
    c * (t /= d) * t * t * t + b
  ),

  easeOutQuart: (_, t, b, c, d) => (
    -c * ((t = t / d - 1) * t * t * t - 1) + b
  ),

  easeInOutQuart: (_, t, b, c, d) => (
    (t /= d / 2) < 1 ? c / 2 * t * t * t * t + b : -c / 2 * ((t -= 2) * t * t * t - 2) + b
  ),

  easeInQuint: (_, t, b, c, d) => (
    c * (t /= d) * t * t * t * t + b
  ),

  easeOutQuint: (_, t, b, c, d) => (
    c * ((t = t / d - 1) * t * t * t * t + 1) + b
  ),

  easeInOutQuint: (_, t, b, c, d) => (
    (t /= d / 2) < 1 ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b
  ),

  easeInSine: (_, t, b, c, d) => (
    -c * cos(t / d * (PI / 2)) + c + b
  ),

  easeOutSine: (_, t, b, c, d) => (
    c * sin(t / d * (PI / 2)) + b
  ),

  easeInOutSine: (_, t, b, c, d) => (
    -c / 2 * (cos(PI * t / d) - 1) + b
  ),

  easeInExpo: (_, t, b, c, d) => (
    (t === 0) ? b : c * pow(2, 10 * (t / d - 1)) + b
  ),

  easeOutExpo: (_, t, b, c, d) => (
    (t === d) ? b + c : c * (-pow(2, -10 * t / d) + 1) + b
  ),

  easeInOutExpo: (_, t, b, c, d) => {
    if (t === 0) return b;
    if (t === d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-pow(2, -10 * --t) + 2) + b;
  },

  easeInCirc: (_, t, b, c, d) => (
    -c * (sqrt(1 - (t /= d) * t) - 1) + b
  ),

  easeOutCirc: (_, t, b, c, d) => (
    c * sqrt(1 - (t = t / d - 1) * t) + b
  ),

  easeInOutCirc: (_, t, b, c, d) => (
    (t /= d / 2) < 1 ? -c / 2 * (sqrt(1 - t * t) - 1) + b : c / 2 * (sqrt(1 - (t -= 2) * t) + 1) + b
  ),
};
