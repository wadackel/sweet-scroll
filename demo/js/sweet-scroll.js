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

  function isRootContainer(el) {
    var doc = document;
    return el === doc.documentElement || el === doc.body;
  }

  function getOffset(el) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    if (!el.getClientRects().length) return { top: 0, left: 0 };
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
        scroll.top = ctx.scrollTop;
        scroll.left = ctx.scrollLeft;
      }
      return {
        top: rect.top + scroll.top - ctx.clientTop,
        left: rect.left + scroll.left - ctx.clientLeft
      };
    }
    return rect;
  }

  function $(selector) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    return (context == null ? document : context).querySelector(selector);
  }

  function $$(selector) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    return (context == null ? document : context).querySelectorAll(selector);
  }

  var directionPropMap = {
    y: "scrollTop",
    x: "scrollLeft"
  };

  function getScrollable(selectors) {
    var direction = arguments.length <= 1 || arguments[1] === undefined ? "y" : arguments[1];
    var all = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var prop = directionPropMap[direction];
    var elements = $$(selectors);
    var scrollables = [];

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];

      if (el[prop] > 0) {
        scrollables.push(el);
      } else {
        el[prop] = 1;
        if (el[prop] > 0) {
          scrollables.push(el);
        }
        el[prop] = 0;
      }

      if (!all && scrollables.length > 0) break;
    }

    return scrollables;
  }

  function scrollableFind(selectors, direction) {
    var scrollables = getScrollable(selectors, direction, false);
    return scrollables.length >= 1 ? scrollables[0] : undefined;
  }

  var doc = document;
  var win = window;

  var SweetScroll = (function () {
    function SweetScroll() {
      var _this = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var container = arguments.length <= 1 || arguments[1] === undefined ? "body, html" : arguments[1];
      babelHelpers.classCallCheck(this, SweetScroll);

      this.options = merge({}, SweetScroll.defaults, options);
      this.container = scrollableFind(container);
      this.el = $$(this.options.trigger);
      each(this.el, function (el) {
        el.addEventListener("click", _this._handleTriggerClick.bind(_this), false);
      });
    }

    babelHelpers.createClass(SweetScroll, [{
      key: "to",
      value: function to(distance) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.stop();

        var container = this.container;

        var params = merge({}, this.options, options);
        var scroll = {};
        var offset = this.formatCoodinate(params.offset);

        if (isString(distance)) {
          if (!/[:,]/.test(distance)) {
            var target = $(distance);
            var targetOffset = getOffset(target, container);
            if (!targetOffset) return;
            scroll.top = targetOffset.top;
            scroll.left = targetOffset.left;
          } else {
            // @TODO
          }
        } else {}
          // @TODO

          // @TODO
          // scroll.top += offset.top;
          // scroll.left += offset.left;

        var frameSize = undefined;
        var size = undefined;
        if (isRootContainer(container)) {
          frameSize = { width: win.innerWidth, height: win.innerHeight };
          size = { width: doc.body.scrollWidth, height: doc.body.scrollHeight };
        } else {
          frameSize = { width: container.clientWidth, height: container.clientHeight };
          size = { width: container.scrollWidth, height: container.scrollHeight };
        }

        scroll.top = scroll.top + frameSize.height > size.height ? size.height - frameSize.height : scroll.top;
        scroll.left = scroll.left + frameSize.width > size.width ? size.width - frameSize.width : scroll.left;

        // @TODO animation
      }
    }, {
      key: "toTop",
      value: function toTop(distance) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.to(distance, merge({}, this.options, {
          verticalScroll: true,
          horizontalScroll: false
        }));
      }
    }, {
      key: "toLeft",
      value: function toLeft(distance) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.to(distance, merge({}, this.options, {
          verticalScroll: false,
          horizontalScroll: true
        }));
      }
    }, {
      key: "stop",
      value: function stop() {
        // @TODO
      }
    }, {
      key: "destroy",
      value: function destroy() {
        // @TODO
      }
    }, {
      key: "formatCoodinate",
      value: function formatCoodinate(coodinate) {
        // @TODO
      }
    }, {
      key: "encodeCoodinate",
      value: function encodeCoodinate(coodinate) {
        // @TODO
      }
    }, {
      key: "_handleTriggerClick",
      value: function _handleTriggerClick(e) {
        var options = this.options;

        var href = e.currentTarget.getAttribute("href");

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
    }]);
    return SweetScroll;
  })();

  SweetScroll.defaults = {
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
  };

  var sweetScroll = new SweetScroll({
    trigger: "a[href^='#']"
  });

  return SweetScroll;

}));