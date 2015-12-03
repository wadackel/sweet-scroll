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
        // @TODO

        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
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

        var verticalEnable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      }
    }, {
      key: "encodeCoodinate",
      value: function encodeCoodinate(coodinate) {
        // @TODO
      }
    }, {
      key: "_handleTriggerClick",
      value: function _handleTriggerClick(e) {
        e.preventDefault();
        if (this.options.stopPropagation) {
          e.stopPropagation();
        }
        // @TODO
      }
    }]);
    return SweetScroll;
  })();

  SweetScroll.defaults = {
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
  };

  var sweetScroll = new SweetScroll({
    trigger: "a[href^='#']"
  });

  return SweetScroll;

}));