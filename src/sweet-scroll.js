import * as Util from "./utils"
import * as Dom from "./dom"
import {$, $$, matches} from "./selectors"
import ScrollTween from "./scroll-tween"

const doc = document;
const win = window;
const WHEEL_EVENT = ("onwheel" in doc ? "wheel" : "onmousewheel" in doc ? "mousewheel" : "DOMMouseScroll");

class SweetScroll {
  static defaults = {
    trigger: "[data-scroll]",
    header: "[data-scroll-header]",
    duration: 1000,
    delay: 0,
    easing: "easeOutQuint",
    offset: 0,
    verticalScroll: true,
    horizontalScroll: false,
    stopScroll: true,
    stopPropagation: true,
    beforeScroll: null,
    afterScroll: null,
    cancelScroll: null
  }

  constructor(options = {}, container = "body, html") {
    this.options = Util.merge({}, SweetScroll.defaults, options);
    this.container = Dom.scrollableFind(container);
    this.header = $(this.options.header);
    this.el = $$(this.options.trigger);
    this.tween = new ScrollTween(this.container);
    this._bindContainerClick();
  }

  to(distance, options = {}) {
    this.stop();

    const {container} = this;
    const params = Util.merge({}, this.options, options);
    const offset = this._parseCoodinate(params.offset);
    let scroll = this._parseCoodinate(distance);

    if (!container) return;

    if (!scroll && Util.isString(distance)) {
      if (distance === "#") {
        scroll = {top: 0, left: 0};

      } else if (!/[:,]/.test(distance)) {
        const target = $(distance);
        const targetOffset = Dom.getOffset(target, container);
        if (!targetOffset) return;
        scroll = targetOffset;
      }
    }

    if (!scroll) return;

    if (offset) {
      scroll.top += offset.top;
      scroll.left +=  offset.left;
    }

    if (this.header) {
      scroll.top -= this.header.clientHeight;
    }

    let frameSize;
    let size;
    if (Dom.isRootContainer(container)) {
      frameSize = {width: win.innerWidth, height: win.innerHeight};
      size = {width: doc.body.scrollWidth, height: doc.body.scrollHeight};
    } else {
      frameSize = {width: container.clientWidth, height: container.clientHeight};
      size = {width: container.scrollWidth, height: container.scrollHeight};
    }

    if (params.verticalScroll) {
      scroll.top = scroll.top + frameSize.height > size.height ? size.height - frameSize.height : scroll.top;
    } else {
      scroll.top = Dom.getScroll(container, "y");
    }

    if (params.horizontalScroll) {
      scroll.left = scroll.left + frameSize.width > size.width ? size.width - frameSize.width : scroll.left;
    } else {
      scroll.left = Dom.getScroll(container, "x");
    }

    if (this._hook(params.beforeScroll, scroll) === false) return;

    this.tween.run(scroll.left, scroll.top, params.duration, params.delay, params.easing, () => {
      this._unbindContainerStop();
      this._hook(params.afterScroll, scroll);
    });

    this._bindContainerStop();
  }

  toTop(distance, options = {}) {
    this.to(distance, Util.merge({}, options, {
      verticalScroll: true,
      horizontalScroll: false
    }));
  }

  toLeft(distance, options = {}) {
    this.to(distance, Util.merge({}, options, {
      verticalScroll: false,
      horizontalScroll: true
    }));
  }

  stop(gotoEnd = false) {
    this.tween.stop(gotoEnd);
  }

  destroy() {
    this.stop();
    this._unbindContainerClick();
    this._unbindContainerStop();
  }

  _bindContainerClick() {
    if (!this.container) return;
    this._containerClickListener = this._handleContainerClick.bind(this);
    this.container.addEventListener("click", this._containerClickListener, false);
  }

  _unbindContainerClick() {
    if (!this.container || !this._containerClickListener) return;
    this.container.removeEventListener("click", this._containerClickListener, false);
    this._containerClickListener = null;
  }

  _bindContainerStop() {
    if (!this.container) return;
    const {container} = this;
    this._stopScrollListener = this._handleStopScroll.bind(this);
    container.addEventListener(WHEEL_EVENT, this._stopScrollListener, false);
    container.addEventListener("touchstart", this._stopScrollListener, false);
    container.addEventListener("touchmove", this._stopScrollListener, false);
  }

  _unbindContainerStop() {
    if (!this.container || !this._stopScrollListener) return;
    const {container} = this;
    container.removeEventListener(WHEEL_EVENT, this._stopScrollListener, false);
    container.removeEventListener("touchstart", this._stopScrollListener, false);
    container.removeEventListener("touchmove", this._stopScrollListener, false);
    this._stopScrollListener = null;
  }

  _hook(callback, ...args) {
    if (Util.isFunction(callback)) {
      return callback.apply(this, args);
    }
  }

  _parseCoodinate(coodinate) {
    const enableTop = this.options.verticalScroll;
    let scroll = {top: 0, left: 0};

    if (Util.hasProp(coodinate, "top") || Util.hasProp(coodinate, "left")) {
      scroll = Util.merge(scroll, coodinate);

    } else if (Util.isArray(coodinate)) {
      if (coodinate.length === 2) {
        scroll.top = coodinate[0];
        scroll.left = coodinate[1];
      } else {
        scroll.top = enableTop ? coodinate[0] : 0;
        scroll.left = !enableTop ? coodinate[0] : 0;
      }

    } else if (Util.isNumeric(coodinate)) {
      scroll.top = enableTop ? coodinate : 0;
      scroll.left = !enableTop ? coodinate : 0;

    } else if (Util.isString(coodinate)) {
      coodinate = Util.removeSpaces(coodinate);

      if (/^\d+,\d+$/.test(coodinate)) {
        coodinate = coodinate.split(",");
        scroll.top = coodinate[0];
        scroll.left = coodinate[1];

      } else if (/^(top|left):\d+,?(?:(top|left):\d+)?$/.test(coodinate)) {
        const top = coodinate.match(/top:(\d+)/);
        const left = coodinate.match(/left:(\d+)/);
        scroll.top = top ? top[1] : 0;
        scroll.left = left ? left[1] : 0;

      } else if (/^(\+|-)=(\d+)$/.test(coodinate)) {
        const current = Dom.getScroll(this.container, enableTop ? "y" : "x");
        const matches = coodinate.match(/^(\+|-)\=(\d+)$/);
        const op = matches[1];
        const value = parseInt(matches[2], 10);
        if (op === "+") {
          scroll.top = enableTop ? current + value : 0;
          scroll.left = !enableTop ? current + value : 0;
        } else {
          scroll.top = enableTop ? current - value : 0;
          scroll.left = !enableTop ? current - value : 0;
        }

      } else {
        return null;
      }

    } else {
      return null;
    }

    scroll.top = parseInt(scroll.top);
    scroll.left = parseInt(scroll.left);

    return scroll;
  }

  _handleStopScroll(e) {
    if (this.options.stopScroll) {
      if (this._hook(this.options.cancelScroll) !== false) {
        this.stop();
      }
    } else {
      e.stopPropagation();
    }
  }

  _handleContainerClick(e) {
    let {options} = this;
    let el = e.target;

    for (; el && el !== doc; el = el.parentNode) {
      if (!matches(el, options.trigger)) continue;
      const data = el.getAttribute("data-scroll");
      const dataOptions = this._parseDataOptions(el);
      const href = data || el.getAttribute("href");

      options = Util.merge({}, options, dataOptions);

      e.preventDefault();
      if (options.stopPropagation) e.stopPropagation();

      if (options.horizontalScroll && options.verticalScroll) {
        this.to(href, options);

      } else if (options.verticalScroll) {
        this.toTop(href, options);

      } else if (options.horizontalScroll) {
        this.toLeft(href, options);
      }
    }
  }

  _parseDataOptions(el) {
    const options = el.getAttribute("data-scroll-options");
    return options ? JSON.parse(options) : {};
  }
}


export default SweetScroll;
