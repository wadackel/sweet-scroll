import * as Util from "./utils"
import * as Dom from "./dom"
import {$, $$} from "./selectors"
import ScrollTween from "./scroll-tween"

const doc = document;
const win = window;
const WHEEL_EVENT = ("onwheel" in doc ? "wheel" : "onmousewheel" in doc ? "mousewheel" : "DOMMouseScroll");

class SweetScroll {
  static defaults = {
    trigger: "[data-scroll]",
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
    this.containerSelector = container;
    this.container = Dom.scrollableFind(container);
    this.el = $$(this.options.trigger);
    this.tween = new ScrollTween(this.container);
    this._bindTriggerListeners();
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
      this._hook(params.afterScroll, scroll);
    });

    this.stopScrollListener = this._handleStopScroll.bind(this);
    doc.addEventListener(WHEEL_EVENT, this.stopScrollListener, false);
    doc.addEventListener("touchstart", this.stopScrollListener, false);
    doc.addEventListener("touchmove", this.stopScrollListener, false);
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
    if (this.stopScrollListener) {
      doc.removeEventListener(WHEEL_EVENT, this.stopScrollListener, false);
      doc.removeEventListener("touchstart", this.stopScrollListener, false);
      doc.removeEventListener("touchmove", this.stopScrollListener, false);
    }
    this.tween.stop(gotoEnd);
  }

  update(options = {}) {
    this._unbindTriggerListeners();

    this.options = Util.merge({}, this.options, options);
    this.container = Dom.scrollableFind(this.containerSelector);
    this.el = $$(this.options.trigger);
    this._bindTriggerListeners();
  }

  destroy() {
    this.stop();
    this._unbindTriggerListeners();
  }

  _bindTriggerListeners() {
    this.triggerClickListener = this._handleTriggerClick.bind(this);
    if (this.el.length > 0) {
      Util.each(this.el, (el) => {
        if (el instanceof HTMLElement) el.addEventListener("click", this.triggerClickListener, false);
      });
    }
  }

  _unbindTriggerListeners() {
    if (this.triggerClickListener && this.el.length > 0) {
      Util.each(this.el, (el) => {
        if (el instanceof HTMLElement) el.removeEventListener("click", this.triggerClickListener, false);
      });
    }
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

  _handleTriggerClick(e) {
    const {options} = this;
    const el = e.currentTarget;
    const data = el.getAttribute("data-scroll");
    const href = data || el.getAttribute("href");

    e.preventDefault();
    if (options.stopPropagation) e.stopPropagation();

    if (options.horizontalScroll && options.verticalScroll) {
      this.to(href);

    } else if (options.verticalScroll) {
      this.toTop(href);

    } else if (options.horizontalScroll) {
      this.toLeft(href);
    }
  }
}


export default SweetScroll;