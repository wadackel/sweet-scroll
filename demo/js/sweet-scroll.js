/*!
 * sweet-scroll
 * Modern and the sweet smooth scroll library.
 * 
 * @author tsuyoshiwada
 * @homepage https://github.com/tsuyoshiwada/sweet-scroll
 * @license MIT
 * @version 0.0.1
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.SweetScroll = factory();
}(this, function () { 'use strict';

  var babelHelpers = {};

  babelHelpers.typeof = function (obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = (function () {
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
  })();

  babelHelpers;
  function $(selector) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    return (context == null ? document : context).querySelector(selector);
  }

  function $$(selector) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    return (context == null ? document : context).querySelectorAll(selector);
  }

  function matches(el, selector) {
    var matches = (el.document || el.ownerDocument).querySelectorAll(selector);
    var i = matches.length;
    while (--i >= 0 && matches.item(i) !== el) {}
    return i > -1;
  }

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var classTypeList = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol"];
  var classTypes = {};

  classTypeList.forEach(function (name) {
    classTypes["[object " + name + "]"] = name.toLowerCase();
  });

  function getType(obj) {
    if (obj == null) {
      return obj + "";
    }
    return (typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj)) === "object" || typeof obj === "function" ? classTypes[Object.prototype.toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj);
  }

  function isArray(obj) {
    return Array.isArray(obj);
  }

  function isArrayLike(obj) {
    var length = obj == null ? null : obj.length;
    return isNumber(length) && length >= 0 && length <= MAX_ARRAY_INDEX;
  }

  function isObject(obj) {
    return !isArray(obj) && getType(obj) === "object";
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

  function isNumeric(obj) {
    return !isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
  }

  function hasProp(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key);
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

  function each(obj, iterate, context) {
    if (obj == null) return obj;

    context = context || obj;

    if (isObject(obj)) {
      for (var key in obj) {
        if (!hasProp(obj, key)) continue;
        if (iterate.call(context, obj[key], key) === false) break;
      }
    } else if (isArrayLike(obj)) {
      var i = undefined,
          length = obj.length;
      for (i = 0; i < length; i++) {
        if (iterate.call(context, obj[i], i) === false) break;
      }
    }

    return obj;
  }

  function removeSpaces(str) {
    return str.replace(/\s*/g, "") || "";
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
    var doc = document;
    return el === doc.documentElement || el === doc.body;
  }

  function getScrollable(selectors) {
    var direction = arguments.length <= 1 || arguments[1] === undefined ? "y" : arguments[1];
    var all = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var method = directionMethodMap[direction];
    var elements = $$(selectors);
    var scrollables = [];

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];

      if (el[method] > 0) {
        scrollables.push(el);
      } else {
        el[method] = 1;
        if (el[method] > 0) {
          scrollables.push(el);
        }
        el[method] = 0;
      }

      if (!all && scrollables.length > 0) break;
    }

    return scrollables;
  }

  function scrollableFind(selectors, direction) {
    var scrollables = getScrollable(selectors, direction, false);
    return scrollables.length >= 1 ? scrollables[0] : undefined;
  }

  function getWindow(el) {
    return el != null && el === el.window ? el : el.nodeType === 9 && el.defaultView;
  }

  function getScroll(el) {
    var direction = arguments.length <= 1 || arguments[1] === undefined ? "y" : arguments[1];

    var method = directionMethodMap[direction];
    var prop = directionPropMap[direction];
    var win = getWindow(el);
    return win ? win[prop] : el[method];
  }

  function setScroll(el, offset) {
    var direction = arguments.length <= 2 || arguments[2] === undefined ? "y" : arguments[2];

    var method = directionMethodMap[direction];
    var win = getWindow(el);
    var top = direction === "y";
    if (win) {
      win.scrollTo(!top ? offset : win.pageXOffset, top ? offset : win.pageYOffset);
    } else {
      el[method] = offset;
    }
  }

  function getOffset(el) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    if (!el || el && !el.getClientRects().length) {
      return { top: 0, left: 0 };
    }
    var rect = el.getBoundingClientRect();
    if (rect.width || rect.height) {
      var scroll = {};
      var ctx = undefined;
      if (context == null || isRootContainer(context)) {
        ctx = el.ownerDocument.documentElement;
        scroll.top = window.pageYOffset;
        scroll.left = window.pageXOffset;
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

  var lastTime = 0;

  var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    var currentTime = Date.now();
    var timeToCall = Math.max(0, 16 - (currentTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currentTime + timeToCall);
    }, timeToCall);
    lastTime = currentTime + timeToCall;
    return id;
  };

  function linear(p) {
    return p;
  }

  function easeInQuad(x, t, b, c, d) {
    return c * (t /= d) * t + b;
  }

  function easeOutQuad(x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  }

  function easeInOutQuad(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    }
    return -c / 2 * (--t * (t - 2) - 1) + b;
  }

  function easeInCubic(x, t, b, c, d) {
    return c * (t /= d) * t * t + b;
  }

  function easeOutCubic(x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  }

  function easeInOutCubic(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  }

  function easeInQuart(x, t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  }

  function easeOutQuart(x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  }

  function easeInOutQuart(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t + b;
    }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  }

  function easeInQuint(x, t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  }

  function easeOutQuint(x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  }

  function easeInOutQuint(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  }

  function easeInSine(x, t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  }

  function easeOutSine(x, t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  }

  function easeInOutSine(x, t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  }

  function easeInExpo(x, t, b, c, d) {
    return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  }

  function easeOutExpo(x, t, b, c, d) {
    return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  }

  function easeInOutExpo(x, t, b, c, d) {
    if (t === 0) return b;
    if (t === d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  }

  function easeInCirc(x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  }

  function easeOutCirc(x, t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  }

  function easeInOutCirc(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    }
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  }

  function easeInElastic(x, t, b, c, d) {
    var s = 1.70158,
        p = 0,
        a = c;
    if (t === 0) return b;
    if ((t /= d) === 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  }

  function easeOutElastic(x, t, b, c, d) {
    var s = 1.70158,
        p = 0,
        a = c;
    if (t === 0) return b;
    if ((t /= d) === 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  }

  function easeInOutElastic(x, t, b, c, d) {
    var s = 1.70158,
        p = 0,
        a = c;
    if (t === 0) return b;
    if ((t /= d / 2) === 2) return b + c;
    if (!p) p = d * (.3 * 1.5);
    if (a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    if (t < 1) {
      return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
  }

  function easeInBack(x, t, b, c, d) {
    var s = arguments.length <= 5 || arguments[5] === undefined ? 1.70158 : arguments[5];

    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  }

  function easeOutBack(x, t, b, c, d) {
    var s = arguments.length <= 5 || arguments[5] === undefined ? 1.70158 : arguments[5];

    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  }

  function easeInOutBack(x, t, b, c, d) {
    var s = arguments.length <= 5 || arguments[5] === undefined ? 1.70158 : arguments[5];

    if ((t /= d / 2) < 1) {
      return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
    }
    return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  }

  function easeInBounce(x, t, b, c, d) {
    return c - easeOutBounce(x, d - t, 0, c, d) + b;
  }

  function easeOutBounce(x, t, b, c, d) {
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

  function easeInOutBounce(x, t, b, c, d) {
    if (t < d / 2) {
      return easeInBounce(x, t * 2, 0, c, d) * .5 + b;
    }
    return easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
  }

  var Easing = Object.freeze({
    linear: linear,
    easeInQuad: easeInQuad,
    easeOutQuad: easeOutQuad,
    easeInOutQuad: easeInOutQuad,
    easeInCubic: easeInCubic,
    easeOutCubic: easeOutCubic,
    easeInOutCubic: easeInOutCubic,
    easeInQuart: easeInQuart,
    easeOutQuart: easeOutQuart,
    easeInOutQuart: easeInOutQuart,
    easeInQuint: easeInQuint,
    easeOutQuint: easeOutQuint,
    easeInOutQuint: easeInOutQuint,
    easeInSine: easeInSine,
    easeOutSine: easeOutSine,
    easeInOutSine: easeInOutSine,
    easeInExpo: easeInExpo,
    easeOutExpo: easeOutExpo,
    easeInOutExpo: easeInOutExpo,
    easeInCirc: easeInCirc,
    easeOutCirc: easeOutCirc,
    easeInOutCirc: easeInOutCirc,
    easeInElastic: easeInElastic,
    easeOutElastic: easeOutElastic,
    easeInOutElastic: easeInOutElastic,
    easeInBack: easeInBack,
    easeOutBack: easeOutBack,
    easeInOutBack: easeInOutBack,
    easeInBounce: easeInBounce,
    easeOutBounce: easeOutBounce,
    easeInOutBounce: easeInOutBounce
  });

  var ScrollTween = (function () {
    function ScrollTween(el) {
      babelHelpers.classCallCheck(this, ScrollTween);

      this.el = el;
      this.props = {};
      this.progress = false;
      this.startTime = null;
    }

    babelHelpers.createClass(ScrollTween, [{
      key: "run",
      value: function run(x, y, duration, delay, easing) {
        var _this = this;

        var callback = arguments.length <= 5 || arguments[5] === undefined ? function () {} : arguments[5];

        if (this.progress) return;
        this.props = { x: x, y: y };
        this.duration = duration;
        this.delay = delay;
        this.easing = easing;
        this.callback = callback;
        this.progress = true;

        setTimeout(function () {
          _this.startProps = {
            x: getScroll(_this.el, "x"),
            y: getScroll(_this.el, "y")
          };
          raf(function (time) {
            return _this._loop(time);
          });
        }, delay);
      }
    }, {
      key: "stop",
      value: function stop() {
        var gotoEnd = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

        this.startTime = null;
        this.progress = false;

        if (gotoEnd) {
          setScroll(this.el, this.props.x, "x");
          setScroll(this.el, this.props.y, "y");
        }

        if (isFunction(this.callback)) {
          this.callback();
          this.callback = null;
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

        var el = this.el;
        var props = this.props;
        var duration = this.duration;
        var startTime = this.startTime;
        var startProps = this.startProps;

        var toProps = {};
        var easing = Easing[this.easing];
        var timeElapsed = time - startTime;
        var t = Math.min(1, Math.max(timeElapsed / duration, 0));

        each(props, function (value, key) {
          var initialValue = startProps[key];
          var delta = value - initialValue;
          if (delta === 0) return true;

          var val = easing(t, duration * t, 0, 1, duration);
          toProps[key] = Math.round(initialValue + delta * val);
        });

        each(toProps, function (value, key) {
          setScroll(el, value, key);
        });

        timeElapsed <= duration ? raf(function (time) {
          return _this2._loop(time);
        }) : this.stop(true);
      }
    }]);
    return ScrollTween;
  })();

  var doc = document;
  var win = window;
  var WHEEL_EVENT = "onwheel" in doc ? "wheel" : "onmousewheel" in doc ? "mousewheel" : "DOMMouseScroll";

  var SweetScroll = (function () {
    function SweetScroll() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var container = arguments.length <= 1 || arguments[1] === undefined ? "body, html" : arguments[1];
      babelHelpers.classCallCheck(this, SweetScroll);

      this.options = merge({}, SweetScroll.defaults, options);
      this.container = scrollableFind(container);
      this.header = $(this.options.header);
      this.el = $$(this.options.trigger);
      this.tween = new ScrollTween(this.container);
      this._bindContainerClick();
    }

    babelHelpers.createClass(SweetScroll, [{
      key: "to",
      value: function to(distance) {
        var _this = this;

        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.stop();

        var container = this.container;

        var params = merge({}, this.options, options);
        var offset = this._parseCoodinate(params.offset);
        var scroll = this._parseCoodinate(distance);

        if (!container) return;

        if (!scroll && isString(distance)) {
          if (distance === "#") {
            scroll = { top: 0, left: 0 };
          } else if (!/[:,]/.test(distance)) {
            var target = $(distance);
            var targetOffset = getOffset(target, container);
            if (!targetOffset) return;
            scroll = targetOffset;
          }
        }

        if (!scroll) return;

        if (offset) {
          scroll.top += offset.top;
          scroll.left += offset.left;
        }

        if (this.header) {
          scroll.top -= this.header.clientHeight;
        }

        var frameSize = undefined;
        var size = undefined;
        if (isRootContainer(container)) {
          frameSize = { width: win.innerWidth, height: win.innerHeight };
          size = { width: doc.body.scrollWidth, height: doc.body.scrollHeight };
        } else {
          frameSize = { width: container.clientWidth, height: container.clientHeight };
          size = { width: container.scrollWidth, height: container.scrollHeight };
        }

        if (params.verticalScroll) {
          scroll.top = scroll.top + frameSize.height > size.height ? size.height - frameSize.height : scroll.top;
        } else {
          scroll.top = getScroll(container, "y");
        }

        if (params.horizontalScroll) {
          scroll.left = scroll.left + frameSize.width > size.width ? size.width - frameSize.width : scroll.left;
        } else {
          scroll.left = getScroll(container, "x");
        }

        if (this._hook(params.beforeScroll, scroll) === false) return;

        this.tween.run(scroll.left, scroll.top, params.duration, params.delay, params.easing, function () {
          _this._unbindContainerStop();
          _this._hook(params.afterScroll, scroll);
        });

        this._bindContainerStop();
      }
    }, {
      key: "toTop",
      value: function toTop(distance) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.to(distance, merge({}, options, {
          verticalScroll: true,
          horizontalScroll: false
        }));
      }
    }, {
      key: "toLeft",
      value: function toLeft(distance) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.to(distance, merge({}, options, {
          verticalScroll: false,
          horizontalScroll: true
        }));
      }
    }, {
      key: "stop",
      value: function stop() {
        var gotoEnd = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        this.tween.stop(gotoEnd);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.stop();
        this._unbindContainerClick();
        this._unbindContainerStop();
      }
    }, {
      key: "_bindContainerClick",
      value: function _bindContainerClick() {
        if (!this.container) return;
        this._containerClickListener = this._handleContainerClick.bind(this);
        this.container.addEventListener("click", this._containerClickListener, false);
      }
    }, {
      key: "_unbindContainerClick",
      value: function _unbindContainerClick() {
        if (!this.container || !this._containerClickListener) return;
        this.container.removeEventListener("click", this._containerClickListener, false);
        this._containerClickListener = null;
      }
    }, {
      key: "_bindContainerStop",
      value: function _bindContainerStop() {
        if (!this.container) return;
        var container = this.container;

        this._stopScrollListener = this._handleStopScroll.bind(this);
        container.addEventListener(WHEEL_EVENT, this._stopScrollListener, false);
        container.addEventListener("touchstart", this._stopScrollListener, false);
        container.addEventListener("touchmove", this._stopScrollListener, false);
      }
    }, {
      key: "_unbindContainerStop",
      value: function _unbindContainerStop() {
        if (!this.container || !this._stopScrollListener) return;
        var container = this.container;

        container.removeEventListener(WHEEL_EVENT, this._stopScrollListener, false);
        container.removeEventListener("touchstart", this._stopScrollListener, false);
        container.removeEventListener("touchmove", this._stopScrollListener, false);
        this._stopScrollListener = null;
      }
    }, {
      key: "_hook",
      value: function _hook(callback) {
        if (isFunction(callback)) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          return callback.apply(this, args);
        }
      }
    }, {
      key: "_parseCoodinate",
      value: function _parseCoodinate(coodinate) {
        var enableTop = this.options.verticalScroll;
        var scroll = { top: 0, left: 0 };

        if (hasProp(coodinate, "top") || hasProp(coodinate, "left")) {
          scroll = merge(scroll, coodinate);
        } else if (isArray(coodinate)) {
          if (coodinate.length === 2) {
            scroll.top = coodinate[0];
            scroll.left = coodinate[1];
          } else {
            scroll.top = enableTop ? coodinate[0] : 0;
            scroll.left = !enableTop ? coodinate[0] : 0;
          }
        } else if (isNumeric(coodinate)) {
          scroll.top = enableTop ? coodinate : 0;
          scroll.left = !enableTop ? coodinate : 0;
        } else if (isString(coodinate)) {
          coodinate = removeSpaces(coodinate);

          if (/^\d+,\d+$/.test(coodinate)) {
            coodinate = coodinate.split(",");
            scroll.top = coodinate[0];
            scroll.left = coodinate[1];
          } else if (/^(top|left):\d+,?(?:(top|left):\d+)?$/.test(coodinate)) {
            var top = coodinate.match(/top:(\d+)/);
            var left = coodinate.match(/left:(\d+)/);
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
    }, {
      key: "_handleStopScroll",
      value: function _handleStopScroll(e) {
        if (this.options.stopScroll) {
          if (this._hook(this.options.cancelScroll) !== false) {
            this.stop();
          }
        } else {
          e.stopPropagation();
        }
      }
    }, {
      key: "_handleContainerClick",
      value: function _handleContainerClick(e) {
        var options = this.options;

        var el = e.target;

        for (; el && el !== doc; el = el.parentNode) {
          if (!matches(el, options.trigger)) continue;
          var data = el.getAttribute("data-scroll");
          var href = data || el.getAttribute("href");

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
    }]);
    return SweetScroll;
  })();

  SweetScroll.defaults = {
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
  };

  return SweetScroll;

}));