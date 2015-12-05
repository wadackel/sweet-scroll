import * as Util from "./utils"
import * as Dom from "./dom"
import * as Easing from "./easings"
import {$, $$} from "./selectors"

let lastTime = 0;
const raf =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback){
    const currentTime = Date.now();
    const timeToCall = Math.max(0, 16 - (currentTime - lastTime));
    const id = window.setTimeout(() => { callback(currentTime + timeToCall) }, timeToCall);
    lastTime = currentTime + timeToCall;
    return id;
  };

export default class ScrollTween {
  constructor(el) {
    this.el = el;
    this.props = {};
    this.progress = false;
    this.startTime = null;
  }

  run(x, y, duration, delay, easing, callback = function() {}) {
    if (this.progress) return;
    this.props = {x, y};
    this.duration = duration;
    this.delay = delay;
    this.easing = easing;
    this.callback = callback;

    setTimeout(() => {
      this.progress = true;
      this.startProps = {
        x: Dom.getScroll(this.el, "x"),
        y: Dom.getScroll(this.el, "y")
      };
      raf((time) => this._loop(time));
    }, delay);
  }

  stop(gotoEnd = true) {
    this.startTime = null;
    this.progress = false;

    if (gotoEnd) {
      Dom.setScroll(this.el, this.props.x, "x");
      Dom.setScroll(this.el, this.props.y, "y");
    }

    if (Util.isFunction(this.callback)) {
      this.callback();
    }

    this.callback = null;
  }

  _loop(time) {
    if (!this.startTime) {
      this.startTime = time;
    }

    if (!this.progress) {
      this.stop(false);
      return;
    }

    const {el, props, duration, delay, startTime, startProps} = this;
    const toProps = {};
    const easing = Easing[this.easing];
    const timeElapsed = time - startTime;
    const t = Math.min(1, Math.max(timeElapsed / duration, 0));

    Util.each(props, (value, key) => {
      const initialValue = startProps[key];
      const delta = value - initialValue;
      let val;

      if (delta === 0) return true;

      val = easing(t, duration * t, 0, 1, duration);
      val = Math.round(initialValue + delta * val);

      if (val !== value) {
        toProps[key] = val;
      }
    });

    Util.each(toProps, (value, key) => {
      Dom.setScroll(el, value, key);
    });

    timeElapsed <= duration ? raf((time) => this._loop(time)) : this.stop(true);
  }
}