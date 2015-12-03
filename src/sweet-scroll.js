import * as Util from "./utils"
import {$$} from "./selectors"
import {scrollableFind} from "./scrollable-elements"

class SweetScroll {
  static defaults = {
    trigger: "[data-scroll]",
    target: null,
    duration: 1000,
    delay: 0,
    easing: "easeOutQuint",
    offset: 0,
    changeHash: "",
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
    // @TODO
  }

  destroy() {
    // @TODO
  }

  formatCoodinate(coodinate, verticalEnable = false) {
    // @TODO
  }

  encodeCoodinate(coodinate) {
    // @TODO
  }

  _handleTriggerClick(e) {
    e.preventDefault();
    if (this.options.stopPropagation) {
      e.stopPropagation();
    }
    // @TODO
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
  target: null,
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