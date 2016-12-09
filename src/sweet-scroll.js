import * as Util from "./utils";
import * as Dom from "./dom";
import * as Supports from "./supports";
import * as math from "./math";
import { $, matches } from "./selectors";
import { addEvent, removeEvent } from "./events";
import { win, doc } from "./elements";
import ScrollTween from "./scroll-tween";


const WHEEL_EVENT = (() => {
  if (!Supports.canUseDOM) return "wheel";

  if ("onwheel" in doc) {
    return "wheel";
  } else if ("onmousewheel" in doc) {
    return "mousewheel";
  } else {
    return "DOMMouseScroll";
  }
})();

const CONTAINER_STOP_EVENTS = `${WHEEL_EVENT}, touchstart, touchmove`;


class SweetScroll {

  // Default options
  /* eslint-disable max-len */
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
    updateURL: false,               // Update the URL hash on after scroll (true | false | "push" | "replace")
    preventDefault: true,           // Cancels the container element click event
    stopPropagation: true,          // Prevents further propagation of the container element click event in the bubbling phase
    outputLog: false,               // Specify level of output to log
    quickMode: false,               // Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)

    // Callbacks
    beforeScroll: null,
    afterScroll: null,
    cancelScroll: null,
    completeScroll: null,
    stepScroll: null
  };
  /* eslint-enable max-len */

  /**
   * SweetScroll constructor
   * @constructor
   * @param {Object} options
   * @param {String | Element} container
   */
  constructor(options = {}, container = "body, html") {
    this.isSSR = !Supports.canUseDOM;
    this.options = Util.merge({}, SweetScroll.defaults, options);
    this.container = this.getContainer(container);

    if (this.container == null) {
      this.header = null;
      this.tween = null;

      if (!this.isSSR) {
        if (!/comp|inter|loaded/.test(doc.readyState)) {
          this.log("Should be initialize later than DOMContentLoaded.");
        } else {
          this.log(`Not found scrollable container. => "${container}"`);
        }
      }

    } else {
      this.header = $(this.options.header);
      this.tween = new ScrollTween(this.container);
      this._trigger = null;
      this._shouldCallCancelScroll = false;
      this.bindContainerClick();
    }
  }

  /**
   * Output log
   * @param {String} message
   * @return {void}
   */
  log(message) {
    if (this.options.outputLog) {
      Util.warning(`[SweetScroll] ${message}`);
    }
  }

  /**
   * Get scroll offset
   * @param {*} distance
   * @param {Object} options
   * @return {Object}
   * @private
   */
  getScrollOffset(distance, options) {
    const { container, header } = this;
    const offset = this.parseCoodinate(options.offset);
    let scroll = this.parseCoodinate(distance);

    // Using the coordinates in the case of CSS Selector
    if (!scroll && Util.isString(distance)) {
      if (distance === "#") {
        scroll = {
          top: 0,
          left: 0
        };
      } else {
        const target = $(distance);
        const targetOffset = Dom.getOffset(target, container);
        if (!targetOffset) return;
        scroll = targetOffset;
      }
    }

    if (!scroll) {
      return null;
    }

    // Apply `offset` value
    if (offset) {
      scroll.top += offset.top;
      scroll.left += offset.left;
    }

    // If the header is present apply the height
    if (header) {
      scroll.top = math.max(0, scroll.top - Dom.getSize(header).height);
    }

    return scroll;
  }

  /**
   * Normalize scroll offset
   * @param {Ojbect} scroll
   * @param {Ojbect} options
   * @return {Object}
   * @private
   */
  normalizeScrollOffset(scroll, options) {
    const { container } = this;
    const finalScroll = Util.merge({}, scroll);

    // Determine the final scroll coordinates
    const { viewport, size } = Dom.getViewportAndElementSizes(container);

    // Adjustment of the maximum value
    finalScroll.top = options.verticalScroll
      ? math.max(0, math.min(size.height - viewport.height, finalScroll.top))
      : Dom.getScroll(container, "y");

    finalScroll.left = options.horizontalScroll
      ? math.max(0, math.min(size.width - viewport.width, finalScroll.left))
      : Dom.getScroll(container, "x");

    return finalScroll;
  }

  /**
   * Scroll animation to the specified position
   * @param {*} distance
   * @param {Object} options
   * @return {void}
   */
  to(distance, options = {}) {
    if (this.isSSR) return;

    const { container } = this;
    const params = Util.merge({}, this.options, options);
    const trigger = this._trigger;
    const hash = Util.isString(distance) && /^#/.test(distance) ? distance : null;

    // Temporary options
    this._options = params;

    // Remove the triggering elements which has been temporarily retained
    this._trigger = null;

    // Disable the call flag of `cancelScroll`
    this._shouldCallCancelScroll = false;

    // Stop current animation
    this.stop();

    // Does not move if the container is not found
    if (!container) {
      return this.log("Not found container element.");
    }

    // Get scroll offset
    let scroll = this.getScrollOffset(distance, params);

    if (!scroll) {
      return this.log(`Invalid parameter of distance. => ${distance}`);
    }

    // Call `beforeScroll`
    // Stop scrolling when it returns false
    if (this.hook(params, "beforeScroll", scroll, trigger) === false) {
      this._options = null;
      return;
    }

    scroll = this.normalizeScrollOffset(scroll, params);

    // Run the animation!!
    this.tween.run(scroll.left, scroll.top, {
      duration: params.duration,
      delay: params.delay,
      easing: params.easing,
      quickMode: params.quickMode,
      complete: () => {
        // Update URL
        if (hash != null && hash !== win.location.hash) {
          this.updateURLHash(hash, params.updateURL);
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
      },
      step: (currentTime, props) => {
        this.hook(params, "stepScroll", currentTime, props);
      }
    });

    // Bind the scroll stop events
    this.bindContainerStop();
  }

  /**
   * Scroll animation to the specified top position
   * @param {*} distance
   * @param {Object} options
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
   * @param {*} distance
   * @param {Object} options
   * @return {void}
   */
  toLeft(distance, options = {}) {
    this.to(distance, Util.merge({}, options, {
      verticalScroll: false,
      horizontalScroll: true
    }));
  }

  /**
   * Scroll animation to the specified element
   * @param {Element} el
   * @param {Object} options
   * @return {void}
   */
  toElement(el, options = {}) {
    if (this.isSSR) return;

    if (el instanceof Element) {
      const offset = Dom.getOffset(el, this.container);
      this.to(offset, Util.merge({}, options));
    } else {
      this.log("Invalid parameter.");
    }
  }

  /**
   * Stop the current animation
   * @param {Boolean} gotoEnd
   * @return {void}
   */
  stop(gotoEnd = false) {
    if (this.isSSR) return;

    if (!this.container) {
      this.log("Not found scrollable container.");

    } else {
      if (this._stopScrollListener) {
        this._shouldCallCancelScroll = true;
      }

      this.tween.stop(gotoEnd);
    }
  }

  /**
   * Update the instance
   * @param {Object} options
   * @return {void}
   */
  update(options = {}) {
    if (!this.container) {
      if (!this.isSSR) {
        this.log("Not found scrollable container.");
      }
    } else {
      this.stop();
      this.unbindContainerClick();
      this.unbindContainerStop();
      this.options = Util.merge({}, this.options, options);
      this.header = $(this.options.header);
      this.bindContainerClick();
    }
  }

  /**
   * Destroy SweetScroll instance
   * @return {void}
   */
  destroy() {
    if (!this.container) {
      if (!this.isSSR) {
        this.log("Not found scrollable container.");
      }
    } else {
      this.stop();
      this.unbindContainerClick();
      this.unbindContainerStop();
      this.container = null;
      this.header = null;
      this.tween = null;
    }
  }

  /* eslint-disable no-unused-vars */
  /**
   * Called at before of the scroll.
   * @param {Object} toScroll
   * @param {Element} trigger
   * @return {Boolean}
   */
  beforeScroll(toScroll, trigger) {
    return true;
  }

  /**
   * Called at cancel of the scroll.
   * @return {void}
   */
  cancelScroll() {}

  /**
   * Called at after of the scroll.
   * @param {Object} toScroll
   * @param {Element} trigger
   * @return {void}
   */
  afterScroll(toScroll, trigger) {}

  /**
   * Called at complete of the scroll.
   * @param {Boolean} isCancel
   * @return {void}
   */
  completeScroll(isCancel) {}

  /**
   * Called at each animation frame of the scroll.
   * @param {Float} currentTime
   * @param {Object} props
   * @return {void}
   */
  stepScroll(currentTime, props) {}
  /* eslint-enable no-unused-vars */

  /**
   * Parse the value of coordinate
   * @param {*} coodinate
   * @return {Object}
   */
  parseCoodinate(coodinate) {
    const enableTop = this._options ? this._options.verticalScroll : this.options.verticalScroll;
    let scroll = { top: 0, left: 0 };

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
      let trimedCoodinate = Util.removeSpaces(coodinate);

      // "{n},{n}" (Array like syntax)
      if (/^\d+,\d+$/.test(trimedCoodinate)) {
        trimedCoodinate = trimedCoodinate.split(",");
        scroll.top = trimedCoodinate[0];
        scroll.left = trimedCoodinate[1];

      // "top:{n}, left:{n}" (Object like syntax)
      } else if (/^(top|left):\d+,?(?:(top|left):\d+)?$/.test(trimedCoodinate)) {
        const top = trimedCoodinate.match(/top:(\d+)/);
        const left = trimedCoodinate.match(/left:(\d+)/);
        scroll.top = top ? top[1] : 0;
        scroll.left = left ? left[1] : 0;

      // "+={n}", "-={n}" (Relative position)
      } else if (this.container && /^(\+|-)=(\d+)$/.test(trimedCoodinate)) {
        const current = Dom.getScroll(this.container, enableTop ? "y" : "x");
        const results = trimedCoodinate.match(/^(\+|-)=(\d+)$/);
        const op = results[1];
        const value = parseInt(results[2], 10);
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
   * @param {String} hash
   * @param {Boolean | String} historyType
   * @return {void}
   */
  updateURLHash(hash, historyType) {
    if (this.isSSR || !Supports.history || !historyType) return;
    win.history[historyType === "replace" ? "replaceState" : "pushState"](null, null, hash);
  }

  /**
   * Get the container for the scroll, depending on the options.
   * @param {String | Element} selector
   * @return {?Element}
   * @private
   */
  getContainer(selector) {
    const { verticalScroll, horizontalScroll } = this.options;
    let container = null;

    if (this.isSSR) return container;

    if (verticalScroll) {
      container = Dom.scrollableFind(selector, "y");
    }

    if (!container && horizontalScroll) {
      container = Dom.scrollableFind(selector, "x");
    }

    return container;
  }

  /**
   * Bind a click event to the container
   * @return {void}
   * @private
   */
  bindContainerClick() {
    const { container } = this;
    if (!container) return;
    this._containerClickListener = this.handleContainerClick.bind(this);
    addEvent(container, "click", this._containerClickListener);
  }

  /**
   * Unbind a click event to the container
   * @return {void}
   * @private
   */
  unbindContainerClick() {
    const { container } = this;
    if (!container || !this._containerClickListener) return;
    removeEvent(container, "click", this._containerClickListener);
    this._containerClickListener = null;
  }

  /**
   * Bind the scroll stop of events
   * @return {void}
   * @private
   */
  bindContainerStop() {
    const { container } = this;
    if (!container) return;
    this._stopScrollListener = this.handleStopScroll.bind(this);
    addEvent(container, CONTAINER_STOP_EVENTS, this._stopScrollListener);
  }

  /**
   * Unbind the scroll stop of events
   * @return {void}
   * @private
   */
  unbindContainerStop() {
    const { container } = this;
    if (!container || !this._stopScrollListener) return;
    removeEvent(container, CONTAINER_STOP_EVENTS, this._stopScrollListener);
    this._stopScrollListener = null;
  }

  /**
   * Call the specified callback
   * @param {Object} options
   * @param {String} type
   * @param {...*} args
   * @return {void}
   * @private
   */
  hook(options, type, ...args) {
    const callback = options[type];

    // callback
    if (Util.isFunction(callback)) {
      const result = callback.apply(this, args);
      if (typeof result === "undefined") return result;
    }

    // method
    return this[type](...args);
  }

  /**
   * Handling of scroll stop event
   * @param {Event} e
   * @return {void}
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
   * @param {Event} e
   * @return {void}
   * @private
   */
  handleContainerClick(e) {
    let { options } = this;
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
   * @param {Element} el
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
