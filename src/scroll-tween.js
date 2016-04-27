import * as Util from "./utils"
import * as Dom from "./dom"
import * as Easing from "./easings"
import raf from "./request-animation-frame"

export default class ScrollTween {
  constructor(el) {
    this.el = el;
    this.props = {};
    this.options = {};
    this.progress = false;
    this.easing = null;
    this.startTime = null;
  }

  run(x, y, options) {
    if (this.progress) return;
    this.props = {x, y};
    this.options = options;
    this.easing = Util.isFunction(options.easing) ? options.easing : Easing[options.easing.replace("ease", "")];
    this.progress = true;

    setTimeout(() => {
      this.startProps = {
        x: Dom.getScroll(this.el, "x"),
        y: Dom.getScroll(this.el, "y")
      };
      raf((time) => this._loop(time));
    }, this.options.delay);
  }

  stop(gotoEnd = true) {
    const {complete} = this.options;
    this.startTime = null;
    this.progress = false;

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

    const {el, props, options, startTime, startProps, easing} = this;
    const {duration, step} = options;
    const toProps = {};
    const timeElapsed = time - startTime;
    const t = Math.min(1, Math.max(timeElapsed / duration, 0));

    Util.each(props, (value, key) => {
      const initialValue = startProps[key];
      const delta = value - initialValue;
      if (delta === 0) return true;

      const val = easing(t, duration * t, 0, 1, duration);
      toProps[key] = Math.round(initialValue + delta * val);
    });

    Util.each(toProps, (value, key) => {
      Dom.setScroll(el, value, key);
    });

    if (timeElapsed <= duration) {
      step.call(this, t, toProps);
      raf((time) => this._loop(time));

    } else {
      this.stop(true);
    }
  }
}
