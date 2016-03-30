import * as Util from "./utils"
import * as Dom from "./dom"
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

    // Callbacks
    initialized: null,
    beforeScroll: null,
    afterScroll: null,
    cancelScroll: null
  };

  /**
   * SweetScroll constructor
   * @param {Object}
   * @param {String} | {HTMLElement}
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
      this.initialized();
      this.hook(params.initialized);
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
    const offset = this.parseCoodinate(params.offset);
    const trigger = this._trigger;
    let scroll = this.parseCoodinate(distance);

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
      scroll.left += offset.left;
    }

    // If the header is present apply the height
    if (header) {
      scroll.top = Math.max(0, scroll.top - this.header.clientHeight);
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

    // Call `beforeScroll`
    // Stop scrolling when it returns false
    if (this.hook(params.beforeScroll, scroll, trigger) === false || this.beforeScroll(scroll, trigger) === false) {
      return;
    }

    // Adjustment of the maximum value
    // vertical
    if (params.verticalScroll) {
      scroll.top = Math.max(0, Math.min(size.height - frameSize.height, scroll.top));
    } else {
      scroll.top = Dom.getScroll(container, "y");
    }

    // horizontal
    if (params.horizontalScroll) {
      scroll.left = Math.max(0, Math.min(size.width - frameSize.width, scroll.left));
    } else {
      scroll.left = Dom.getScroll(container, "x");
    }

    // Run the animation!!
    this.tween.run(scroll.left, scroll.top, params.duration, params.delay, params.easing, () => {
      // Unbind the scroll stop events, And call `afterScroll` or `cancelScroll`
      this.unbindContainerStop();
      if (this._shouldCallCancelScroll) {
        this.hook(params.cancelScroll);
        this.cancelScroll();
      } else {
        this.hook(params.afterScroll, scroll, trigger);
        this.afterScroll(scroll, trigger);
      }
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
   * @param {HTMLElement}
   * @param {Object}
   * @return {Void}
   */
  toElement($el, options = {}) {
    if ($el instanceof HTMLElement) {
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
   * @param {HTMLElement}
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
   * @param {HTMLElement}
   * @return {Void}
   */
  afterScroll(toScroll, trigger) {
  }

  /**
   * Parse the value of coordinate
   * @param {Any}
   * @return {Object}
   */
  parseCoodinate(coodinate) {
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

    scroll.top = parseInt(scroll.top, 10);
    scroll.left = parseInt(scroll.left, 10);

    return scroll;
  }

  /**
   * Get the container for the scroll, depending on the options.
   * @param {String} | {HTMLElement}
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
      addEvent(doc, DOM_CONTENT_LOADED, () => {
        this.getContainer(selector, callback);
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
   * @param {Function}
   * @param {...Any}
   * @return {Void}
   * @private
   */
  hook(callback, ...args) {
    if (Util.isFunction(callback)) {
      return callback.apply(this, args);
    }
  }

  /**
   * Handling of scroll stop event
   * @param {Event}
   * @return {Void}
   * @private
   */
  handleStopScroll(e) {
    if (this.options.stopScroll) {
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

      e.preventDefault();
      e.stopPropagation();

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
   * @param {HTMLElement}
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
