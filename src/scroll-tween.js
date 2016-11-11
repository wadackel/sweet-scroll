import * as Util from "./utils";
import * as Dom from "./dom";
import * as Easing from "./easings";
import * as math from "./math";
import { raf, caf } from "./request-animation-frame";


export default class ScrollTween {
  constructor(el) {
    this.el = el;
    this.props = {};
    this.options = {};
    this.progress = false;
    this.easing = null;
    this.startTime = null;
    this.rafId = null;
  }

  run(x, y, options) {
    if (this.progress) return;
    this.props = { x, y };
    this.options = options;
    this.easing = Util.isFunction(options.easing)
      ? options.easing
      : Easing[options.easing.replace("ease", "")];
    this.progress = true;

    setTimeout(() => {
      this.startProps = this.calcStartProps(x, y);
      this.rafId = raf(time => this._loop(time));
    }, this.options.delay);
  }

  stop(gotoEnd = true) {
    const { complete } = this.options;
    this.startTime = null;
    this.progress = false;
    caf(this.rafId);

    if (gotoEnd) {
      Dom.setScroll(this.el, this.props.x, "x");
      Dom.setScroll(this.el, this.props.y, "y");
    }

    if (Util.isFunction(complete)) {
      complete.call(this);
      this.options.complete = null;
    }
  }

  _loop(time) {
    if (!this.startTime) {
      this.startTime = time;
    }

    if (!this.progress) {
      this.stop(false);

      return;
    }

    const { el, props, options, startTime, startProps, easing } = this;
    const { duration, step } = options;
    const toProps = {};
    const timeElapsed = time - startTime;
    const t = math.min(1, math.max(timeElapsed / duration, 0));

    Util.each(props, (value, key) => {
      const initialValue = startProps[key];
      const delta = value - initialValue;
      if (delta === 0) return true;

      const val = easing(t, duration * t, 0, 1, duration);
      toProps[key] = math.round(initialValue + delta * val);
    });

    Util.each(toProps, (value, key) => {
      Dom.setScroll(el, value, key);
    });

    if (timeElapsed <= duration) {
      step.call(this, t, toProps);
      this.rafId = raf(currentTime => this._loop(currentTime));
    } else {
      this.stop(true);
    }
  }

  calcStartProps(x, y) {
    const startProps = {
      x: Dom.getScroll(this.el, "x"),
      y: Dom.getScroll(this.el, "y")
    };

    if (this.options.quickMode) {
      const { viewport: { width, height } } = Dom.getViewportAndElementSizes(this.el);

      if (math.abs(startProps.y - y) > height) {
        startProps.y = startProps.y > y ? y + height : y - height;
      }

      if (math.abs(startProps.x - x) > width) {
        startProps.x = startProps.x > x ? x + width : x - width;
      }
    }

    return startProps;
  }
}
