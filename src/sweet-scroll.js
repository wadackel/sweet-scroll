import * as Util from "./utils"
import * as Dom from "./dom"
import {$, $$, matches} from "./selectors"
import ScrollTween from "./scroll-tween"

const win = window;
const doc = document;
const WHEEL_EVENT = ("onwheel" in doc ? "wheel" : "onmousewheel" in doc ? "mousewheel" : "DOMMouseScroll");

class SweetScroll {

  // Default options
  static defaults = {
    trigger: "[data-scroll]",       // Selector for trigger (must be a valid css selector)
    header: "[data-scroll-header]", // Selector for fixed header (must be a valid css selector)
    duration: 1000,                 // Specifies animation duration in integer
    delay: 0,                       // Specifies timer for delaying the execution of the scroll in milliseconds
    easing: "easeOutQuint",         // Specifies the pattern of easing
    offset: 0,                      // Specifies the value to offset the scroll position in pixels
    verticalScroll: true,           // Enable the vertical scroll
    horizontalScroll: false,        // Enable the horizontal scroll
    stopScroll: true,               // When fired wheel or touchstart events to stop scrolling

    // Callbacks
    beforeScroll: null,
    afterScroll: null,
    cancelScroll: null
  }

  /**
   * SweetScroll constructor
   * @param {object}
   * @param {string}
   */
  constructor(options = {}, container = "body, html") {
    this.options = Util.merge({}, SweetScroll.defaults, options);
    this.container = this._getContainer(container);
    this.header = $(this.options.header);
    this.el = $$(this.options.trigger);
    this.tween = new ScrollTween(this.container);
    this._bindContainerClick();
  }

  /**
   * Scroll animation to the specified position
   * @param {any}
   * @param {object}
   * @return {void}
   */
  to(distance, options = {}) {
    const {container} = this;
    const params = Util.merge({}, this.options, options);
    const offset = this._parseCoodinate(params.offset);
    let scroll = this._parseCoodinate(distance);

    // Stop current animation
    this.stop();

    // Does not move if the container is not found
    if (!container) return;

    // Using the coordinates in the case of CSS Selector
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

    // Apply `offset` value
    if (offset) {
      scroll.top += offset.top;
      scroll.left +=  offset.left;
    }

    // If the header is present apply the height
    if (this.header) {
      scroll.top -= this.header.clientHeight;
    }

    // Determine the final scroll coordinates
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

    // Call `beforeScroll`
    // Stop scrolling when it returns false
    if (this._hook(params.beforeScroll, scroll) === false) return;

    this.tween.run(scroll.left, scroll.top, params.duration, params.delay, params.easing, () => {
      // Unbind the scroll stop events, And call `afterScroll`
      this._unbindContainerStop();
      this._hook(params.afterScroll, scroll);
    });

    // Bind the scroll stop events
    this._bindContainerStop();
  }

  /**
   * Scroll animation to the specified top position
   * @param {any}
   * @param {object}
   * @return {void}
   */
  toTop(distance, options = {}) {
    this.to(distance, Util.merge({}, options, {
      verticalScroll: true,
      horizontalScroll: false
    }));
  }

  /**
   * Scroll animation to the specified left position
   * @param {any}
   * @param {object}
   * @return {void}
   */
  toLeft(distance, options = {}) {
    this.to(distance, Util.merge({}, options, {
      verticalScroll: false,
      horizontalScroll: true
    }));
  }

  /**
   * Stop the current animation
   * @param {boolean}
   * @return {void}
   */
  stop(gotoEnd = false) {
    this.tween.stop(gotoEnd);
  }

  /**
   * Destroy SweetScroll instance
   * @param {boolean}
   * @return {void}
   */
  destroy() {
    this.stop();
    this._unbindContainerClick();
    this._unbindContainerStop();
  }

  /**
   * Get the container for the scroll, depending on the options.
   * @param {string}
   * @return {HTMLElement}
   * @private
   */
  _getContainer(selector) {
    const {verticalScroll, horizontalScroll} = this.options;
    let direction;
    if (verticalScroll || (verticalScroll && horizontalScroll)) {
      direction = "y";
    } else if (horizontalScroll) {
      direction = "x";
    }
    return Dom.scrollableFind(selector, direction);
  }

  /**
   * Bind a click event to the container
   * @return {void}
   * @private
   */
  _bindContainerClick() {
    if (!this.container) return;
    this._containerClickListener = this._handleContainerClick.bind(this);
    this.container.addEventListener("click", this._containerClickListener, false);
  }

  /**
   * Unbind a click event to the container
   * @return {void}
   * @private
   */
  _unbindContainerClick() {
    if (!this.container || !this._containerClickListener) return;
    this.container.removeEventListener("click", this._containerClickListener, false);
    this._containerClickListener = null;
  }

  /**
   * Bind the scroll stop of events
   * @return {void}
   * @private
   */
  _bindContainerStop() {
    if (!this.container) return;
    const {container} = this;
    this._stopScrollListener = this._handleStopScroll.bind(this);
    container.addEventListener(WHEEL_EVENT, this._stopScrollListener, false);
    container.addEventListener("touchstart", this._stopScrollListener, false);
    container.addEventListener("touchmove", this._stopScrollListener, false);
  }

  /**
   * Unbind the scroll stop of events
   * @return {void}
   * @private
   */
  _unbindContainerStop() {
    if (!this.container || !this._stopScrollListener) return;
    const {container} = this;
    container.removeEventListener(WHEEL_EVENT, this._stopScrollListener, false);
    container.removeEventListener("touchstart", this._stopScrollListener, false);
    container.removeEventListener("touchmove", this._stopScrollListener, false);
    this._stopScrollListener = null;
  }

  /**
   * Call the specified callback
   * @param {string}
   * @param {...any}
   * @return {void}
   * @private
   */
  _hook(callback, ...args) {
    if (Util.isFunction(callback)) {
      return callback.apply(this, args);
    }
  }

  /**
   * Parse the value of coordinate
   * @param {any}
   * @return {object}
   * @private
   */
  _parseCoodinate(coodinate) {
    const enableTop = this.options.verticalScroll;
    let scroll = {top: 0, left: 0};

    // Object
    if (Util.hasProp(coodinate, "top") || Util.hasProp(coodinate, "left")) {
      scroll = Util.merge(scroll, coodinate);

    // Array
    } else if (Util.isArray(coodinate)) {
      if (coodinate.length === 2) {
        scroll.top = coodinate[0];
        scroll.left = coodinate[1];
      } else {
        scroll.top = enableTop ? coodinate[0] : 0;
        scroll.left = !enableTop ? coodinate[0] : 0;
      }

    // Number
    } else if (Util.isNumeric(coodinate)) {
      scroll.top = enableTop ? coodinate : 0;
      scroll.left = !enableTop ? coodinate : 0;

    // String
    } else if (Util.isString(coodinate)) {
      coodinate = Util.removeSpaces(coodinate);

      // "{n},{n}" (Array like syntax)
      if (/^\d+,\d+$/.test(coodinate)) {
        coodinate = coodinate.split(",");
        scroll.top = coodinate[0];
        scroll.left = coodinate[1];

      // "top:{n}, left:{n}" (Object like syntax)
      } else if (/^(top|left):\d+,?(?:(top|left):\d+)?$/.test(coodinate)) {
        const top = coodinate.match(/top:(\d+)/);
        const left = coodinate.match(/left:(\d+)/);
        scroll.top = top ? top[1] : 0;
        scroll.left = left ? left[1] : 0;

      // "+={n}", "-={n}" (Relative position)
      } else if (this.container && /^(\+|-)=(\d+)$/.test(coodinate)) {
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

  /**
   * Handling of scroll stop event
   * @param {Event}
   * @return {void}
   * @private
   */
  _handleStopScroll(e) {
    if (this.options.stopScroll) {
      if (this._hook(this.options.cancelScroll) !== false) {
        this.stop();
      }
    } else {
      e.preventDefault();
    }
  }

  /**
   * Handling of container click event
   * @param {Event}
   * @return {void}
   * @private
   */
  _handleContainerClick(e) {
    let {options} = this;
    let el = e.target;

    // Explore parent element until the trigger selector matches
    for (; el && el !== doc; el = el.parentNode) {
      if (!matches(el, options.trigger)) continue;
      const data = el.getAttribute("data-scroll");
      const dataOptions = this._parseDataOptions(el);
      const href = data || el.getAttribute("href");

      options = Util.merge({}, options, dataOptions);

      e.preventDefault();
      e.stopPropagation();

      if (options.horizontalScroll && options.verticalScroll) {
        this.to(href, options);

      } else if (options.verticalScroll) {
        this.toTop(href, options);

      } else if (options.horizontalScroll) {
        this.toLeft(href, options);
      }
    }
  }

  /**
   * Parse the data-scroll-options attribute
   * @param {HTMLElement}
   * @return {object}
   * @private
   */
  _parseDataOptions(el) {
    const options = el.getAttribute("data-scroll-options");
    return options ? JSON.parse(options) : {};
  }
}


// Export SweetScroll class
export default SweetScroll;
