/*!
 * sweet-scroll
 * Modern and the sweet smooth scroll library.
 * @author tsuyoshiwada
 * @license MIT
 * @version 2.2.1
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.SweetScroll = factory());
}(this, (function () { 'use strict';

var cos = Math.cos;
var sin = Math.sin;
var pow = Math.pow;
var abs = Math.abs;
var sqrt = Math.sqrt;
var asin = Math.asin;
var PI = Math.PI;
var max = Math.max;
var min = Math.min;
var round = Math.round;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var MAX_ARRAY_INDEX = pow(2, 53) - 1;
var classTypeList = ["Boolean", "Number", "String", "Function", "Array", "Object"];
var classTypes = {};

classTypeList.forEach(function (name) {
  classTypes["[object " + name + "]"] = name.toLowerCase();
});

function getType(obj) {
  if (obj == null) {
    return "";
  }

  return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? classTypes[Object.prototype.toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
}

function isNumber(obj) {
  return getType(obj) === "number";
}

function isString(obj) {
  return getType(obj) === "string";
}



function isFunction(obj) {
  return getType(obj) === "function";
}

function isArray(obj) {
  return Array.isArray(obj);
}

function isArrayLike(obj) {
  var length = obj == null ? null : obj.length;

  return isNumber(length) && length >= 0 && length <= MAX_ARRAY_INDEX;
}

function isNumeric(obj) {
  return !isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
}

function isObject(obj) {
  return !isArray(obj) && getType(obj) === "object";
}

function hasProp(obj, key) {
  return obj && obj.hasOwnProperty(key);
}



function each(obj, iterate, context) {
  if (obj == null) return obj;

  var ctx = context || obj;

  if (isObject(obj)) {
    for (var key in obj) {
      if (!hasProp(obj, key)) continue;
      if (iterate.call(ctx, obj[key], key) === false) break;
    }
  } else if (isArrayLike(obj)) {
    for (var i = 0; i < obj.length; i++) {
      if (iterate.call(ctx, obj[i], i) === false) break;
    }
  }

  return obj;
}

function merge(obj) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  each(sources, function (source) {
    each(source, function (value, key) {
      obj[key] = value;
    });
  });

  return obj;
}

function removeSpaces(str) {
  return str.replace(/\s*/g, "") || "";
}

function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  /* eslint-enable no-console */

  /* eslint-disable no-empty */
  try {
    throw new Error(message);
  } catch (e) {}
  /* eslint-enable no-empty */
}

// @link https://github.com/JedWatson/exenv/blob/master/index.js
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);

// @link https://github.com/Modernizr/Modernizr
var history = function () {
  if (!canUseDOM) return false;

  var ua = navigator.userAgent;
  if ((ua.indexOf("Android 2.") !== -1 || ua.indexOf("Android 4.0") !== -1) && ua.indexOf("Mobile Safari") !== -1 && ua.indexOf("Chrome") === -1 && ua.indexOf("Windows Phone") === -1) {
    return false;
  }

  return window.history && "pushState" in window.history && window.location.protocol !== "file:";
}();

var win = canUseDOM ? window : null;
var doc = canUseDOM ? document : null;

function $(selector) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!selector) return;

  return (context == null ? doc : context).querySelector(selector);
}

function $$(selector) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!selector) return;

  return (context == null ? doc : context).querySelectorAll(selector);
}

function matches(el, selector) {
  var results = (el.document || el.ownerDocument).querySelectorAll(selector);
  var i = results.length;
  while (--i >= 0 && results.item(i) !== el) {}

  return i > -1;
}

var directionMethodMap = {
  y: "scrollTop",
  x: "scrollLeft"
};

var directionPropMap = {
  y: "pageYOffset",
  x: "pageXOffset"
};

function isRootContainer(el) {
  return el === doc.documentElement || el === doc.body;
}

function getZoomLevel() {
  var outerWidth = win.outerWidth,
      innerWidth = win.innerWidth;


  return outerWidth ? outerWidth / innerWidth : 1;
}

function getScrollable(selectors) {
  var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "y";
  var all = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var method = directionMethodMap[direction];
  var elements = selectors instanceof Element ? [selectors] : $$(selectors);
  var scrollables = [];
  var $div = doc.createElement("div");

  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];

    if (el[method] > 0) {
      scrollables.push(el);
    } else {
      $div.style.width = el.clientWidth + 1 + "px";
      $div.style.height = el.clientHeight + 1 + "px";
      el.appendChild($div);

      el[method] = 1.5 / getZoomLevel();
      if (el[method] > 0) {
        scrollables.push(el);
      }
      el[method] = 0;

      el.removeChild($div);
    }

    if (!all && scrollables.length > 0) break;
  }

  return scrollables;
}

function scrollableFind(selectors, direction) {
  var scrollables = getScrollable(selectors, direction, false);

  return scrollables.length >= 1 ? scrollables[0] : null;
}

function getWindow(el) {
  return el != null && el === el.window ? el : el.nodeType === 9 && el.defaultView;
}

function getHeight(el) {
  return max(el.scrollHeight, el.clientHeight, el.offsetHeight);
}

function getWidth(el) {
  return max(el.scrollWidth, el.clientWidth, el.offsetWidth);
}

function getSize(el) {
  return {
    width: getWidth(el),
    height: getHeight(el)
  };
}

function getDocumentSize() {
  return {
    width: max(getWidth(doc.body), getWidth(doc.documentElement)),
    height: max(getHeight(doc.body), getHeight(doc.documentElement))
  };
}

function getViewportAndElementSizes(el) {
  if (isRootContainer(el)) {
    return {
      viewport: {
        width: min(win.innerWidth, doc.documentElement.clientWidth),
        height: win.innerHeight
      },
      size: getDocumentSize()
    };
  }

  return {
    viewport: {
      width: el.clientWidth,
      height: el.clientHeight
    },
    size: getSize(el)
  };
}

function getScroll(el) {
  var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "y";

  var currentWindow = getWindow(el);

  return currentWindow ? currentWindow[directionPropMap[direction]] : el[directionMethodMap[direction]];
}

function setScroll(el, offset) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "y";

  var currentWindow = getWindow(el);
  var top = direction === "y";
  if (currentWindow) {
    currentWindow.scrollTo(!top ? offset : currentWindow[directionPropMap.x], top ? offset : currentWindow[directionPropMap.y]);
  } else {
    el[directionMethodMap[direction]] = offset;
  }
}

function getOffset(el) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!el || el && !el.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  var rect = el.getBoundingClientRect();

  if (rect.width || rect.height) {
    var scroll = {};
    var ctx = null;
    if (context == null || isRootContainer(context)) {
      ctx = el.ownerDocument.documentElement;
      scroll.top = win.pageYOffset;
      scroll.left = win.pageXOffset;
    } else {
      ctx = context;
      var ctxRect = ctx.getBoundingClientRect();
      scroll.top = ctxRect.top * -1 + ctx.scrollTop;
      scroll.left = ctxRect.left * -1 + ctx.scrollLeft;
    }

    return {
      top: rect.top + scroll.top - ctx.clientTop,
      left: rect.left + scroll.left - ctx.clientLeft
    };
  }

  return rect;
}

function addEvent(el, event, listener) {
  var events = event.split(",");
  events.forEach(function (eventName) {
    el.addEventListener(eventName.trim(), listener, false);
  });
}

function removeEvent(el, event, listener) {
  var events = event.split(",");
  events.forEach(function (eventName) {
    el.removeEventListener(eventName.trim(), listener, false);
  });
}

/* eslint-disable no-param-reassign, newline-before-return, max-params, new-cap */
function linear(p) {
  return p;
}

function InQuad(x, t, b, c, d) {
  return c * (t /= d) * t + b;
}

function OutQuad(x, t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
}

function InOutQuad(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t + b;
  }
  return -c / 2 * (--t * (t - 2) - 1) + b;
}

function InCubic(x, t, b, c, d) {
  return c * (t /= d) * t * t + b;
}

function OutCubic(x, t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

function InOutCubic(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t + b;
  }
  return c / 2 * ((t -= 2) * t * t + 2) + b;
}

function InQuart(x, t, b, c, d) {
  return c * (t /= d) * t * t * t + b;
}

function OutQuart(x, t, b, c, d) {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
}

function InOutQuart(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t * t + b;
  }
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}

function InQuint(x, t, b, c, d) {
  return c * (t /= d) * t * t * t * t + b;
}

function OutQuint(x, t, b, c, d) {
  return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
}

function InOutQuint(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t * t * t + b;
  }
  return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}

function InSine(x, t, b, c, d) {
  return -c * cos(t / d * (PI / 2)) + c + b;
}

function OutSine(x, t, b, c, d) {
  return c * sin(t / d * (PI / 2)) + b;
}

function InOutSine(x, t, b, c, d) {
  return -c / 2 * (cos(PI * t / d) - 1) + b;
}

function InExpo(x, t, b, c, d) {
  return t === 0 ? b : c * pow(2, 10 * (t / d - 1)) + b;
}

function OutExpo(x, t, b, c, d) {
  return t === d ? b + c : c * (-pow(2, -10 * t / d) + 1) + b;
}

function InOutExpo(x, t, b, c, d) {
  if (t === 0) return b;
  if (t === d) return b + c;
  if ((t /= d / 2) < 1) return c / 2 * pow(2, 10 * (t - 1)) + b;
  return c / 2 * (-pow(2, -10 * --t) + 2) + b;
}

function InCirc(x, t, b, c, d) {
  return -c * (sqrt(1 - (t /= d) * t) - 1) + b;
}

function OutCirc(x, t, b, c, d) {
  return c * sqrt(1 - (t = t / d - 1) * t) + b;
}

function InOutCirc(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return -c / 2 * (sqrt(1 - t * t) - 1) + b;
  }
  return c / 2 * (sqrt(1 - (t -= 2) * t) + 1) + b;
}

function InElastic(x, t, b, c, d) {
  var s = 1.70158;
  var p = 0;
  var a = c;
  if (t === 0) return b;
  if ((t /= d) === 1) return b + c;
  if (!p) p = d * .3;
  if (a < abs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = p / (2 * PI) * asin(c / a);
  }
  return -(a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p)) + b;
}

function OutElastic(x, t, b, c, d) {
  var s = 1.70158;
  var p = 0;
  var a = c;
  if (t === 0) return b;
  if ((t /= d) === 1) return b + c;
  if (!p) p = d * .3;
  if (a < abs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = p / (2 * PI) * asin(c / a);
  }
  return a * pow(2, -10 * t) * sin((t * d - s) * (2 * PI) / p) + c + b;
}

function InOutElastic(x, t, b, c, d) {
  var s = 1.70158;
  var p = 0;
  var a = c;
  if (t === 0) return b;
  if ((t /= d / 2) === 2) return b + c;
  if (!p) p = d * (.3 * 1.5);
  if (a < abs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = p / (2 * PI) * asin(c / a);
  }
  if (t < 1) {
    return -.5 * (a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p)) + b;
  }
  return a * pow(2, -10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p) * .5 + c + b;
}

function InBack(x, t, b, c, d) {
  var s = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1.70158;

  return c * (t /= d) * t * ((s + 1) * t - s) + b;
}

function OutBack(x, t, b, c, d) {
  var s = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1.70158;

  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
}

function InOutBack(x, t, b, c, d) {
  var s = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1.70158;

  if ((t /= d / 2) < 1) {
    return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
  }
  return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
}

function OutBounce(x, t, b, c, d) {
  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
  } else {
    return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
  }
}

function InBounce(x, t, b, c, d) {
  return c - OutBounce(x, d - t, 0, c, d) + b;
}

function InOutBounce(x, t, b, c, d) {
  if (t < d / 2) {
    return InBounce(x, t * 2, 0, c, d) * .5 + b;
  }
  return OutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
}

var Easing = Object.freeze({
	linear: linear,
	InQuad: InQuad,
	OutQuad: OutQuad,
	InOutQuad: InOutQuad,
	InCubic: InCubic,
	OutCubic: OutCubic,
	InOutCubic: InOutCubic,
	InQuart: InQuart,
	OutQuart: OutQuart,
	InOutQuart: InOutQuart,
	InQuint: InQuint,
	OutQuint: OutQuint,
	InOutQuint: InOutQuint,
	InSine: InSine,
	OutSine: OutSine,
	InOutSine: InOutSine,
	InExpo: InExpo,
	OutExpo: OutExpo,
	InOutExpo: InOutExpo,
	InCirc: InCirc,
	OutCirc: OutCirc,
	InOutCirc: InOutCirc,
	InElastic: InElastic,
	OutElastic: OutElastic,
	InOutElastic: InOutElastic,
	InBack: InBack,
	OutBack: OutBack,
	InOutBack: InOutBack,
	OutBounce: OutBounce,
	InBounce: InBounce,
	InOutBounce: InOutBounce
});

var vendors = ["ms", "moz", "webkit"];
var lastTime = 0;

var raf = canUseDOM ? win.requestAnimationFrame : null;
var caf = canUseDOM ? win.cancelAnimationFrame : null;

if (canUseDOM) {
  for (var x = 0; x < vendors.length && !raf; ++x) {
    raf = win[vendors[x] + "RequestAnimationFrame"];
    caf = win[vendors[x] + "CancelAnimationFrame"] || win[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!raf) {
    raf = function raf(callback) {
      var currentTime = Date.now();
      var timeToCall = max(0, 16 - (currentTime - lastTime));
      var id = setTimeout(function () {
        callback(currentTime + timeToCall);
      }, timeToCall);

      lastTime = currentTime + timeToCall;

      return id;
    };
  }

  if (!caf) {
    caf = function caf(id) {
      clearTimeout(id);
    };
  }
}

var ScrollTween = function () {
  function ScrollTween(el) {
    classCallCheck(this, ScrollTween);

    this.el = el;
    this.props = {};
    this.options = {};
    this.progress = false;
    this.easing = null;
    this.startTime = null;
    this.rafId = null;
  }

  createClass(ScrollTween, [{
    key: "run",
    value: function run(x, y, options) {
      var _this = this;

      if (this.progress) return;
      this.props = { x: x, y: y };
      this.options = options;
      this.easing = isFunction(options.easing) ? options.easing : Easing[options.easing.replace("ease", "")];
      this.progress = true;

      setTimeout(function () {
        _this.startProps = _this.calcStartProps(x, y);
        _this.rafId = raf(function (time) {
          return _this._loop(time);
        });
      }, this.options.delay);
    }
  }, {
    key: "stop",
    value: function stop() {
      var gotoEnd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var complete = this.options.complete;

      this.startTime = null;
      this.progress = false;
      caf(this.rafId);

      if (gotoEnd) {
        setScroll(this.el, this.props.x, "x");
        setScroll(this.el, this.props.y, "y");
      }

      if (isFunction(complete)) {
        complete.call(this);
        this.options.complete = null;
      }
    }
  }, {
    key: "_loop",
    value: function _loop(time) {
      var _this2 = this;

      if (!this.startTime) {
        this.startTime = time;
      }

      if (!this.progress) {
        this.stop(false);

        return;
      }

      var el = this.el,
          props = this.props,
          options = this.options,
          startTime = this.startTime,
          startProps = this.startProps,
          easing = this.easing;
      var duration = options.duration,
          step = options.step;

      var toProps = {};
      var timeElapsed = time - startTime;
      var t = min(1, max(timeElapsed / duration, 0));

      each(props, function (value, key) {
        var initialValue = startProps[key];
        var delta = value - initialValue;
        if (delta === 0) return true;

        var val = easing(t, duration * t, 0, 1, duration);
        toProps[key] = round(initialValue + delta * val);
      });

      each(toProps, function (value, key) {
        setScroll(el, value, key);
      });

      if (timeElapsed <= duration) {
        step.call(this, t, toProps);
        this.rafId = raf(function (currentTime) {
          return _this2._loop(currentTime);
        });
      } else {
        this.stop(true);
      }
    }
  }, {
    key: "calcStartProps",
    value: function calcStartProps(x, y) {
      var startProps = {
        x: getScroll(this.el, "x"),
        y: getScroll(this.el, "y")
      };

      if (this.options.quickMode) {
        var _Dom$getViewportAndEl = getViewportAndElementSizes(this.el),
            _Dom$getViewportAndEl2 = _Dom$getViewportAndEl.viewport,
            width = _Dom$getViewportAndEl2.width,
            height = _Dom$getViewportAndEl2.height;

        if (abs(startProps.y - y) > height) {
          startProps.y = startProps.y > y ? y + height : y - height;
        }

        if (abs(startProps.x - x) > width) {
          startProps.x = startProps.x > x ? x + width : x - width;
        }
      }

      return startProps;
    }
  }]);
  return ScrollTween;
}();

var WHEEL_EVENT = function () {
  if (!canUseDOM) return "wheel";

  if ("onwheel" in doc) {
    return "wheel";
  } else if ("onmousewheel" in doc) {
    return "mousewheel";
  } else {
    return "DOMMouseScroll";
  }
}();

var CONTAINER_STOP_EVENTS = WHEEL_EVENT + ", touchstart, touchmove";

var SweetScroll = function () {
  /* eslint-enable max-len */

  /**
   * SweetScroll constructor
   * @constructor
   * @param {Object} options
   * @param {String | Element} container
   */
  function SweetScroll() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "body, html";
    classCallCheck(this, SweetScroll);

    this.isSSR = !canUseDOM;
    this.options = merge({}, SweetScroll.defaults, options);
    this.container = this.getContainer(container);

    if (this.container == null) {
      this.header = null;
      this.tween = null;

      if (!this.isSSR) {
        if (!/comp|inter|loaded/.test(doc.readyState)) {
          this.log("Should be initialize later than DOMContentLoaded.");
        } else {
          this.log("Not found scrollable container. => \"" + container + "\"");
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


  // Default options
  /* eslint-disable max-len */


  createClass(SweetScroll, [{
    key: "log",
    value: function log(message) {
      if (this.options.outputLog) {
        warning("[SweetScroll] " + message);
      }
    }

    /**
     * Get scroll offset
     * @param {*} distance
     * @param {Object} options
     * @return {Object}
     * @private
     */

  }, {
    key: "getScrollOffset",
    value: function getScrollOffset(distance, options) {
      var container = this.container,
          header = this.header;

      var offset = this.parseCoodinate(options.offset);
      var scroll = this.parseCoodinate(distance);

      // Using the coordinates in the case of CSS Selector
      if (!scroll && isString(distance)) {
        if (distance === "#") {
          scroll = {
            top: 0,
            left: 0
          };
        } else {
          var target = $(distance);
          var targetOffset = getOffset(target, container);
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
        scroll.top = max(0, scroll.top - getSize(header).height);
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

  }, {
    key: "normalizeScrollOffset",
    value: function normalizeScrollOffset(scroll, options) {
      var container = this.container;

      var finalScroll = merge({}, scroll);

      // Determine the final scroll coordinates

      var _Dom$getViewportAndEl = getViewportAndElementSizes(container),
          viewport = _Dom$getViewportAndEl.viewport,
          size = _Dom$getViewportAndEl.size;

      // Adjustment of the maximum value


      finalScroll.top = options.verticalScroll ? max(0, min(size.height - viewport.height, finalScroll.top)) : getScroll(container, "y");

      finalScroll.left = options.horizontalScroll ? max(0, min(size.width - viewport.width, finalScroll.left)) : getScroll(container, "x");

      return finalScroll;
    }

    /**
     * Scroll animation to the specified position
     * @param {*} distance
     * @param {Object} options
     * @return {void}
     */

  }, {
    key: "to",
    value: function to(distance) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.isSSR) return;

      var container = this.container;

      var params = merge({}, this.options, options);
      var trigger = this._trigger;
      var hash = isString(distance) && /^#/.test(distance) ? distance : null;

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
      var scroll = this.getScrollOffset(distance, params);

      if (!scroll) {
        return this.log("Invalid parameter of distance. => " + distance);
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
        complete: function complete() {
          // Update URL
          if (hash != null && hash !== win.location.hash) {
            _this.updateURLHash(hash, params.updateURL);
          }

          // Unbind the scroll stop events, And call `afterScroll` or `cancelScroll`
          _this.unbindContainerStop();

          // Remove the temporary options
          _this._options = null;

          // Call `cancelScroll` or `afterScroll`
          if (_this._shouldCallCancelScroll) {
            _this.hook(params, "cancelScroll");
          } else {
            _this.hook(params, "afterScroll", scroll, trigger);
          }

          // Call `completeScroll`
          _this.hook(params, "completeScroll", _this._shouldCallCancelScroll);
        },
        step: function step(currentTime, props) {
          _this.hook(params, "stepScroll", currentTime, props);
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

  }, {
    key: "toTop",
    value: function toTop(distance) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.to(distance, merge({}, options, {
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

  }, {
    key: "toLeft",
    value: function toLeft(distance) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.to(distance, merge({}, options, {
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

  }, {
    key: "toElement",
    value: function toElement(el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.isSSR) return;

      if (el instanceof Element) {
        var offset = getOffset(el, this.container);
        this.to(offset, merge({}, options));
      } else {
        this.log("Invalid parameter.");
      }
    }

    /**
     * Stop the current animation
     * @param {Boolean} gotoEnd
     * @return {void}
     */

  }, {
    key: "stop",
    value: function stop() {
      var gotoEnd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

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

  }, {
    key: "update",
    value: function update() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.container) {
        if (!this.isSSR) {
          this.log("Not found scrollable container.");
        }
      } else {
        this.stop();
        this.unbindContainerClick();
        this.unbindContainerStop();
        this.options = merge({}, this.options, options);
        this.header = $(this.options.header);
        this.bindContainerClick();
      }
    }

    /**
     * Destroy SweetScroll instance
     * @return {void}
     */

  }, {
    key: "destroy",
    value: function destroy() {
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

  }, {
    key: "beforeScroll",
    value: function beforeScroll(toScroll, trigger) {
      return true;
    }

    /**
     * Called at cancel of the scroll.
     * @return {void}
     */

  }, {
    key: "cancelScroll",
    value: function cancelScroll() {}

    /**
     * Called at after of the scroll.
     * @param {Object} toScroll
     * @param {Element} trigger
     * @return {void}
     */

  }, {
    key: "afterScroll",
    value: function afterScroll(toScroll, trigger) {}

    /**
     * Called at complete of the scroll.
     * @param {Boolean} isCancel
     * @return {void}
     */

  }, {
    key: "completeScroll",
    value: function completeScroll(isCancel) {}

    /**
     * Called at each animation frame of the scroll.
     * @param {Float} currentTime
     * @param {Object} props
     * @return {void}
     */

  }, {
    key: "stepScroll",
    value: function stepScroll(currentTime, props) {}
    /* eslint-enable no-unused-vars */

    /**
     * Parse the value of coordinate
     * @param {*} coodinate
     * @return {Object}
     */

  }, {
    key: "parseCoodinate",
    value: function parseCoodinate(coodinate) {
      var enableTop = this._options ? this._options.verticalScroll : this.options.verticalScroll;
      var scroll = { top: 0, left: 0 };

      // Object
      if (hasProp(coodinate, "top") || hasProp(coodinate, "left")) {
        scroll = merge(scroll, coodinate);

        // Array
      } else if (isArray(coodinate)) {
        if (coodinate.length === 2) {
          scroll.top = coodinate[0];
          scroll.left = coodinate[1];
        } else {
          scroll.top = enableTop ? coodinate[0] : 0;
          scroll.left = !enableTop ? coodinate[0] : 0;
        }

        // Number
      } else if (isNumeric(coodinate)) {
        scroll.top = enableTop ? coodinate : 0;
        scroll.left = !enableTop ? coodinate : 0;

        // String
      } else if (isString(coodinate)) {
        var trimedCoodinate = removeSpaces(coodinate);

        // "{n},{n}" (Array like syntax)
        if (/^\d+,\d+$/.test(trimedCoodinate)) {
          trimedCoodinate = trimedCoodinate.split(",");
          scroll.top = trimedCoodinate[0];
          scroll.left = trimedCoodinate[1];

          // "top:{n}, left:{n}" (Object like syntax)
        } else if (/^(top|left):\d+,?(?:(top|left):\d+)?$/.test(trimedCoodinate)) {
          var top = trimedCoodinate.match(/top:(\d+)/);
          var left = trimedCoodinate.match(/left:(\d+)/);
          scroll.top = top ? top[1] : 0;
          scroll.left = left ? left[1] : 0;

          // "+={n}", "-={n}" (Relative position)
        } else if (this.container && /^(\+|-)=(\d+)$/.test(trimedCoodinate)) {
          var current = getScroll(this.container, enableTop ? "y" : "x");
          var results = trimedCoodinate.match(/^(\+|-)=(\d+)$/);
          var op = results[1];
          var value = parseInt(results[2], 10);
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

  }, {
    key: "updateURLHash",
    value: function updateURLHash(hash, historyType) {
      if (this.isSSR || !history || !historyType) return;
      win.history[historyType === "replace" ? "replaceState" : "pushState"](null, null, hash);
    }

    /**
     * Get the container for the scroll, depending on the options.
     * @param {String | Element} selector
     * @return {?Element}
     * @private
     */

  }, {
    key: "getContainer",
    value: function getContainer(selector) {
      var _options = this.options,
          verticalScroll = _options.verticalScroll,
          horizontalScroll = _options.horizontalScroll;

      var container = null;

      if (this.isSSR) return container;

      if (verticalScroll) {
        container = scrollableFind(selector, "y");
      }

      if (!container && horizontalScroll) {
        container = scrollableFind(selector, "x");
      }

      return container;
    }

    /**
     * Bind a click event to the container
     * @return {void}
     * @private
     */

  }, {
    key: "bindContainerClick",
    value: function bindContainerClick() {
      var container = this.container;

      if (!container) return;
      this._containerClickListener = this.handleContainerClick.bind(this);
      addEvent(container, "click", this._containerClickListener);
    }

    /**
     * Unbind a click event to the container
     * @return {void}
     * @private
     */

  }, {
    key: "unbindContainerClick",
    value: function unbindContainerClick() {
      var container = this.container;

      if (!container || !this._containerClickListener) return;
      removeEvent(container, "click", this._containerClickListener);
      this._containerClickListener = null;
    }

    /**
     * Bind the scroll stop of events
     * @return {void}
     * @private
     */

  }, {
    key: "bindContainerStop",
    value: function bindContainerStop() {
      var container = this.container;

      if (!container) return;
      this._stopScrollListener = this.handleStopScroll.bind(this);
      addEvent(container, CONTAINER_STOP_EVENTS, this._stopScrollListener);
    }

    /**
     * Unbind the scroll stop of events
     * @return {void}
     * @private
     */

  }, {
    key: "unbindContainerStop",
    value: function unbindContainerStop() {
      var container = this.container;

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

  }, {
    key: "hook",
    value: function hook(options, type) {
      var callback = options[type];

      // callback

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (isFunction(callback)) {
        var result = callback.apply(this, args);
        if (typeof result === "undefined") return result;
      }

      // method
      return this[type].apply(this, args);
    }

    /**
     * Handling of scroll stop event
     * @param {Event} e
     * @return {void}
     * @private
     */

  }, {
    key: "handleStopScroll",
    value: function handleStopScroll(e) {
      var stopScroll = this._options ? this._options.stopScroll : this.options.stopScroll;
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

  }, {
    key: "handleContainerClick",
    value: function handleContainerClick(e) {
      var options = this.options;

      var el = e.target;

      // Explore parent element until the trigger selector matches
      for (; el && el !== doc; el = el.parentNode) {
        if (!matches(el, options.trigger)) continue;
        var data = el.getAttribute("data-scroll");
        var dataOptions = this.parseDataOptions(el);
        var href = data || el.getAttribute("href");

        options = merge({}, options, dataOptions);

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

  }, {
    key: "parseDataOptions",
    value: function parseDataOptions(el) {
      var options = el.getAttribute("data-scroll-options");
      return options ? JSON.parse(options) : {};
    }
  }]);
  return SweetScroll;
}();

// Export SweetScroll class


SweetScroll.defaults = {
  trigger: "[data-scroll]", // Selector for trigger (must be a valid css selector)
  header: "[data-scroll-header]", // Selector for fixed header (must be a valid css selector)
  duration: 1000, // Specifies animation duration in integer
  delay: 0, // Specifies timer for delaying the execution of the scroll in milliseconds
  easing: "easeOutQuint", // Specifies the pattern of easing
  offset: 0, // Specifies the value to offset the scroll position in pixels
  verticalScroll: true, // Enable the vertical scroll
  horizontalScroll: false, // Enable the horizontal scroll
  stopScroll: true, // When fired wheel or touchstart events to stop scrolling
  updateURL: false, // Update the URL hash on after scroll (true | false | "push" | "replace")
  preventDefault: true, // Cancels the container element click event
  stopPropagation: true, // Prevents further propagation of the container element click event in the bubbling phase
  outputLog: false, // Specify level of output to log
  quickMode: false, // Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)

  // Callbacks
  beforeScroll: null,
  afterScroll: null,
  cancelScroll: null,
  completeScroll: null,
  stepScroll: null
};

return SweetScroll;

})));
