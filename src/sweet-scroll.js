import * as Util from "./utils"
import * as Dom from "./dom"
import * as Supports from "./supports"
import {$, matches} from "./selectors"
import {addEvent, removeEvent} from "./events"
import ScrollTween from "./scroll-tween"

const win = window;
const doc = document;
const WHEEL_EVENT = ("onwheel" in doc ? "wheel" : "onmousewheel" in doc ? "mousewheel" : "DOMMouseScroll");
const CONTAINER_STOP_EVENTS = `${WHEEL_EVENT}, touchstart, touchmove`;
const DOM_CONTENT_LOADED = "DOMContentLoaded";
let isDomContentLoaded = false;

addEvent(doc, DOM_CONTENT_LOADED, () => {
  isDomContentLoaded = true;
});


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
    updateURL: false,               // Update the URL hash on after scroll
    preventDefault: true,           // Cancels the container element click event
    stopPropagation: true,          // Prevents further propagation of the container element click event in the bubbling phase

    // Callbacks
    initialized: null,
    beforeScroll: null,
    afterScroll: null,
    cancelScroll: null,
    completeScroll: null
  };

  /**
   * SweetScroll constructor
   * @param {Object}
   * @param {String} | {Element}
   */
  constructor(options = {}, container = "body, html") {
    const params = Util.merge({}, SweetScroll.defaults, options);
    this.options = params;
    this.getContainer(container, (target) => {
      this.container = target;
      this.header = $(params.header);
      this.tween = new ScrollTween(target);
      this._trigger = null;
      this._shouldCallCancelScroll = false;
      this.bindContainerClick();
      this.hook(params, "initialized");
    });
  }

  /**
   * Scroll animation to the specified position
   * @param {Any}
   * @param {Object}
   * @return {Void}
   */
  to(distance, options = {}) {
    const {container, header} = this;
    const params = Util.merge({}, this.options, options);

    // Temporary options
    this._options = params;

    const offset = this.parseCoodinate(params.offset);
    const trigger = this._trigger;
    let scroll = this.parseCoodinate(distance);
    let hash = null;

    // Remove the triggering elements which has been temporarily retained
    this._trigger = null;

    // Disable the call flag of `cancelScroll`
    this._shouldCallCancelScroll = false;

    // Stop current animation
    this.stop();

    // Does not move if the container is not found
    if (!container) return;

    // Using the coordinates in the case of CSS Selector
    if (!scroll && Util.isString(distance)) {
      hash = /^#/.test(distance) ? distance : null;

      if (distance === "#") {
        scroll = {top: 0, left: 0};

      } else {
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
      scroll.left += offset.left;
    }

    // If the header is present apply the height
    if (header) {
      scroll.top = Math.max(0, scroll.top - Dom.getSize(header).height);
    }

    // Determine the final scroll coordinates
    const {viewport, size} = Dom.getViewportAndElementSizes(container);

    // Call `beforeScroll`
    // Stop scrolling when it returns false
    if (this.hook(params, "beforeScroll", scroll, trigger) === false) {
      return;
    }

    // Adjustment of the maximum value
    scroll.top = params.verticalScroll ? Math.max(0, Math.min(size.height - viewport.height, scroll.top)) : Dom.getScroll(container, "y");
    scroll.left = params.horizontalScroll ? Math.max(0, Math.min(size.width - viewport.width, scroll.left)) : Dom.getScroll(container, "x");

    // Run the animation!!
    this.tween.run(scroll.left, scroll.top, params.duration, params.delay, params.easing, () => {
      // Update URL
      if (hash != null && hash !== window.location.hash && params.updateURL) {
        this.updateURLHash(hash);
      }

      // Unbind the scroll stop events, And call `afterScroll` or `cancelScroll`
      this.unbindContainerStop();

      // Remove the temporary options
      this._options = null;

      // Call `cancelScroll` or `afterScroll`
      if (this._shouldCallCancelScroll) {
        this.hook(params, "cancelScroll");
      } else {
        this.hook(params, "afterScroll", scroll, trigger);
      }

      // Call `completeScroll`
      this.hook(params, "completeScroll", this._shouldCallCancelScroll);
    });

    // Bind the scroll stop events
    this.bindContainerStop();
  }

  /**
   * Scroll animation to the specified top position
   * @param {Any}
   * @param {Object}
   * @return {Void}
   */
  toTop(distance, options = {}) {
    this.to(distance, Util.merge({}, options, {
      verticalScroll: true,
      horizontalScroll: false
    }));
  }

  /**
   * Scroll animation to the specified left position
   * @param {Any}
   * @param {Object}
   * @return {Void}
   */
  toLeft(distance, options = {}) {
    this.to(distance, Util.merge({}, options, {
      verticalScroll: false,
      horizontalScroll: true
    }));
  }

  /**
   * Scroll animation to the specified element
   * @param {Element}
   * @param {Object}
   * @return {Void}
   */
  toElement($el, options = {}) {
    if ($el instanceof Element) {
      const offset = Dom.getOffset($el, this.container);
      this.to(offset, Util.merge({}, options));
    }
  }

  /**
   * Stop the current animation
   * @param {Boolean}
   * @return {Void}
   */
  stop(gotoEnd = false) {
    if (this._stopScrollListener) {
      this._shouldCallCancelScroll = true;
    }
    this.tween.stop(gotoEnd);
  }

  /**
   * Update the instance
   * @param {Object}
   * @return {Void}
   */
  update(options = {}) {
    this.stop();
    this.unbindContainerClick();
    this.unbindContainerStop();
    this.options = Util.merge({}, this.options, options);
    this.header = $(this.options.header);
    this.bindContainerClick();
  }

  /**
   * Destroy SweetScroll instance
   * @param {Boolean}
   * @return {Void}
   */
  destroy() {
    this.stop();
    this.unbindContainerClick();
    this.unbindContainerStop();
    this.container = null;
    this.header = null;
    this.tween = null;
  }

  /**
   * Called at after of the initialize.
   * @return {Void}
   */
  initialized() {
  }

  /**
   * Called at before of the scroll.
   * @param {Object}
   * @param {Element}
   * @return {Boolean}
   */
  beforeScroll(toScroll, trigger) {
    return true;
  }

  /**
   * Called at cancel of the scroll.
   * @return {Void}
   */
  cancelScroll() {
  }

  /**
   * Called at after of the scroll.
   * @param {Object}
   * @param {Element}
   * @return {Void}
   */
  afterScroll(toScroll, trigger) {
  }

  /**
   * Called at complete of the scroll.
   * @param {Boolean}
   * @return {Void}
   */
  completeScroll(isCancel) {
  }

  /**
   * Parse the value of coordinate
   * @param {Any}
   * @return {Object}
   */
  parseCoodinate(coodinate) {
    const enableTop = this._options ? this._options.verticalScroll : this.options.verticalScroll;
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

    scroll.top = parseInt(scroll.top, 10);
    scroll.left = parseInt(scroll.left, 10);

    return scroll;
  }

  /**
   * Update the Hash of the URL.
   * @param {String}
   * @return {Void}
   */
  updateURLHash(hash) {
    if (Supports.pushState) {
      window.history.pushState(null, null, hash);
    }
  }

  /**
   * Get the container for the scroll, depending on the options.
   * @param {String} | {Element}
   * @param {Function}
   * @return {Void}
   * @private
   */
  getContainer(selector, callback) {
    const {verticalScroll, horizontalScroll} = this.options;
    let container;

    if (verticalScroll) {
      container = Dom.scrollableFind(selector, "y");
    }

    if (!container && horizontalScroll) {
      container = Dom.scrollableFind(selector, "x");
    }

    if (!container && !isDomContentLoaded) {
      let isCompleted = false;

      addEvent(doc, DOM_CONTENT_LOADED, () => {
        isCompleted = true;
        this.getContainer(selector, callback);
      });

      // Fallback for DOMContentLoaded
      addEvent(win, "load", () => {
        if (!isCompleted) {
          this.getContainer(selector, callback);
        }
      });
    } else {
      callback.call(this, container);
    }
  }

  /**
   * Bind a click event to the container
   * @return {Void}
   * @private
   */
  bindContainerClick() {
    const {container} = this;
    if (!container) return;
    this._containerClickListener = this.handleContainerClick.bind(this);
    addEvent(container, "click", this._containerClickListener);
  }

  /**
   * Unbind a click event to the container
   * @return {Void}
   * @private
   */
  unbindContainerClick() {
    const {container} = this;
    if (!container || !this._containerClickListener) return;
    removeEvent(container, "click", this._containerClickListener);
    this._containerClickListener = null;
  }

  /**
   * Bind the scroll stop of events
   * @return {Void}
   * @private
   */
  bindContainerStop() {
    const {container} = this;
    if (!container) return;
    this._stopScrollListener = this.handleStopScroll.bind(this);
    addEvent(container, CONTAINER_STOP_EVENTS, this._stopScrollListener);
  }

  /**
   * Unbind the scroll stop of events
   * @return {Void}
   * @private
   */
  unbindContainerStop() {
    const {container} = this;
    if (!container || !this._stopScrollListener) return;
    removeEvent(container, CONTAINER_STOP_EVENTS, this._stopScrollListener);
    this._stopScrollListener = null;
  }

  /**
   * Call the specified callback
   * @param {Object}
   * @param {String}
   * @param {...Any}
   * @return {Void}
   * @private
   */
  hook(options, type, ...args) {
    const callback = options[type];

    // callback
    if (Util.isFunction(callback)) {
      let result = callback.apply(this, args);
      if (result !== undefined) return result;
    }

    // method
    return this[type].apply(this, args);
  }

  /**
   * Handling of scroll stop event
   * @param {Event}
   * @return {Void}
   * @private
   */
  handleStopScroll(e) {
    const stopScroll = this._options ? this._options.stopScroll : this.options.stopScroll;
    if (stopScroll) {
      this.stop();
    } else {
      e.preventDefault();
    }
  }

  /**
   * Handling of container click event
   * @param {Event}
   * @return {Void}
   * @private
   */
  handleContainerClick(e) {
    let {options} = this;
    let el = e.target;

    // Explore parent element until the trigger selector matches
    for (; el && el !== doc; el = el.parentNode) {
      if (!matches(el, options.trigger)) continue;
      const data = el.getAttribute("data-scroll");
      const dataOptions = this.parseDataOptions(el);
      const href = data || el.getAttribute("href");

      options = Util.merge({}, options, dataOptions);

      if (options.preventDefault) e.preventDefault();
      if (options.stopPropagation) e.stopPropagation();

      // Passes the trigger elements to callback
      this._trigger = el;

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
   * @param {Element}
   * @return {Object}
   * @private
   */
  parseDataOptions(el) {
    const options = el.getAttribute("data-scroll-options");
    return options ? JSON.parse(options) : {};
  }
}


// Export SweetScroll class
export default SweetScroll;
