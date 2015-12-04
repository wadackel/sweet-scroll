import * as Util from "./utils"
import * as Dom from "./dom"
import {$, $$} from "./selectors"
import {scrollableFind} from "./scrollable-elements"

const doc = document;
const win = window;

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
    this.container = scrollableFind(container);
    this.el = $$(this.options.trigger);
    Util.each(this.el, (el) => {
      el.addEventListener("click", this._handleTriggerClick.bind(this), false);
    });
  }

  to(distance, options = {}) {
    this.stop();

    const {container} = this;
    const params = Util.merge({}, this.options, options);
    const scroll = {};
    const offset = this.formatCoodinate(params.offset);

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

    scroll.top = scroll.top + frameSize.height > size.height ? size.height - frameSize.height : scroll.top;
    scroll.left = scroll.left + frameSize.width > size.width ? size.width - frameSize.width : scroll.left;

    // @TODO animation
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

  stop() {
    // @TODO
  }

  destroy() {
    // @TODO
  }

  formatCoodinate(coodinate) {
    // @TODO
  }

  encodeCoodinate(coodinate) {
    // @TODO
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
/*
Usage:
const sweetScroll = new SweetScroll({
  trigger: "[data-scroll]",
  duration: 1000,
  delay: 0,
  easing: "easeOutQuint",
  offset: 0
  changeHash: "",
  stopScroll: true,
  stopPropagation: true,
  beforeScroll: null,
  afterScroll: null,
  cancelScroll: null
});

const sweetScroll = new SweetScroll({}, "#container");
sweetScroll.to(100);

*/