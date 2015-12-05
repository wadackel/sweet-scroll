import * as Util from "./utils"
import * as Dom from "./dom"
import {$, $$} from "./selectors"
import ScrollTween from "./scroll-tween"

const doc = document;
const win = window;
const WHEEL_EVENT = ("onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll");

class SweetScroll {
  static defaults = {
    trigger: "[data-scroll]",
    duration: 1000,
    delay: 0,
    easing: "easeOutQuint",
    offset: 0,
    changeHash: false,
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
    this.el = $$(this.options.trigger);
    this.tween = new ScrollTween(this.container);
    this.triggerClickListener = this._handleTriggerClick.bind(this);
    Util.each(this.el, (el) => {
      el.addEventListener("click", this.triggerClickListener, false);
    });

  }

  to(distance, options = {}) {
    this.stop();

    const {container} = this;
    const params = Util.merge({}, this.options, options);
    const scroll = {};
    const offset = this._formatCoodinate(params.offset);

    if (Util.isString(distance)) {
      if (!/[:,]/.test(distance)) {
        const target = $(distance);
        const targetOffset = Dom.getOffset(target, container);
        if (!targetOffset) return;
        scroll.top = targetOffset.top;
        scroll.left = targetOffset.left;
      } else {
        // @TODO
      }
    } else {
      // @TODO
    }

    // @TODO
    // scroll.top += offset.top;
    // scroll.left += offset.left;

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

    // @TODO beforeScroll

    this.tween.run(scroll.left, scroll.top, params.duration, params.delay, params.easing, () => {
      // @TODO afterScroll
    });

    this.stopScrollListener = this._handleStopScroll.bind(this);
    doc.addEventListener(WHEEL_EVENT, this.stopScrollListener, false);
    doc.addEventListener("touchstart", this.stopScrollListener, false);
    doc.addEventListener("touchmove", this.stopScrollListener, false);
  }

  toTop(distance, options = {}) {
    this.to(distance, Util.merge({}, this.options, {
      verticalScroll: true,
      horizontalScroll: false,
    }));
  }

  toLeft(distance, options = {}) {
    this.to(distance, Util.merge({}, this.options, {
      verticalScroll: false,
      horizontalScroll: true,
    }));
  }

  stop(gotoEnd = false) {
    doc.removeEventListener(WHEEL_EVENT, this.stopScrollListener);
    doc.removeEventListener("touchstart", this.stopScrollListener);
    doc.removeEventListener("touchmove", this.stopScrollListener);
    this.tween.stop(gotoEnd);
  }

  destroy() {
    this.stop();
    // @TODO
  }

  _formatCoodinate(coodinate) {
    // @TODO
  }

  _encodeCoodinate(coodinate) {
    // @TODO
  }

  _handleStopScroll(e) {
    if (this.options.stopScroll) {
      this.stop();
    } else {
      e.stopPropagation();
    }
  }

  _handleTriggerClick(e) {
    const {options} = this;
    const href = e.currentTarget.getAttribute("href");

    e.preventDefault();

    if (options.stopPropagation) e.stopPropagation();

    if (options.horizontalScroll && options.verticalScroll) {
      this.to(href);

    } else if (options.verticalScroll) {
      this.toTop(href);

    } else if (options.horizontalScroll) {
      this.toLeft(href);

    } else {
      // @TODO
    }
  }
}

const sweetScroll = new SweetScroll({
  trigger: "a[href^='#']"
});

export default SweetScroll;