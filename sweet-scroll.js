/*! @preserve sweet-scroll v4.0.0 - tsuyoshiwada | MIT License */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.SweetScroll = factory());
}(this, function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    // @link https://github.com/JedWatson/exenv/blob/master/index.js
    var canUseDOM = !!(typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement);
    var canUseHistory = !canUseDOM
        ? false
        : window.history && 'pushState' in window.history && window.location.protocol !== 'file:';
    var canUsePassiveOption = (function () {
        var support = false;
        if (!canUseDOM) {
            return support;
        }
        /* tslint:disable:no-empty */
        try {
            var win = window;
            var opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    support = true;
                },
            });
            win.addEventListener('test', null, opts);
            win.removeEventListener('test', null, opts);
        }
        catch (e) { }
        /* tslint:enable */
        return support;
    })();

    var isString = function (obj) { return typeof obj === 'string'; };
    var isFunction = function (obj) { return typeof obj === 'function'; };
    var isArray = function (obj) { return Array.isArray(obj); };
    var isNumeric = function (obj) { return !isArray(obj) && obj - parseFloat(obj) + 1 >= 0; };
    var hasProp = function (obj, key) { return obj && obj.hasOwnProperty(key); };

    var raf = canUseDOM
        ? window.requestAnimationFrame.bind(window)
        : null;
    var caf = canUseDOM
        ? window.cancelAnimationFrame.bind(window)
        : null;

    /* tslint:disable:curly */
    /* tslint:disable:no-conditional-assignment */
    var cos = Math.cos, sin = Math.sin, pow = Math.pow, sqrt = Math.sqrt, PI = Math.PI;
    var easings = {
        linear: function (p) { return p; },
        easeInQuad: function (_, t, b, c, d) { return c * (t /= d) * t + b; },
        easeOutQuad: function (_, t, b, c, d) { return -c * (t /= d) * (t - 2) + b; },
        easeInOutQuad: function (_, t, b, c, d) {
            return (t /= d / 2) < 1 ? (c / 2) * t * t + b : (-c / 2) * (--t * (t - 2) - 1) + b;
        },
        easeInCubic: function (_, t, b, c, d) { return c * (t /= d) * t * t + b; },
        easeOutCubic: function (_, t, b, c, d) { return c * ((t = t / d - 1) * t * t + 1) + b; },
        easeInOutCubic: function (_, t, b, c, d) {
            return (t /= d / 2) < 1 ? (c / 2) * t * t * t + b : (c / 2) * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function (_, t, b, c, d) { return c * (t /= d) * t * t * t + b; },
        easeOutQuart: function (_, t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b; },
        easeInOutQuart: function (_, t, b, c, d) {
            return (t /= d / 2) < 1 ? (c / 2) * t * t * t * t + b : (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function (_, t, b, c, d) { return c * (t /= d) * t * t * t * t + b; },
        easeOutQuint: function (_, t, b, c, d) { return c * ((t = t / d - 1) * t * t * t * t + 1) + b; },
        easeInOutQuint: function (_, t, b, c, d) {
            return (t /= d / 2) < 1
                ? (c / 2) * t * t * t * t * t + b
                : (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function (_, t, b, c, d) { return -c * cos((t / d) * (PI / 2)) + c + b; },
        easeOutSine: function (_, t, b, c, d) { return c * sin((t / d) * (PI / 2)) + b; },
        easeInOutSine: function (_, t, b, c, d) { return (-c / 2) * (cos((PI * t) / d) - 1) + b; },
        easeInExpo: function (_, t, b, c, d) { return (t === 0 ? b : c * pow(2, 10 * (t / d - 1)) + b); },
        easeOutExpo: function (_, t, b, c, d) { return (t === d ? b + c : c * (-pow(2, (-10 * t) / d) + 1) + b); },
        easeInOutExpo: function (_, t, b, c, d) {
            if (t === 0)
                return b;
            if (t === d)
                return b + c;
            if ((t /= d / 2) < 1)
                return (c / 2) * pow(2, 10 * (t - 1)) + b;
            return (c / 2) * (-pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (_, t, b, c, d) { return -c * (sqrt(1 - (t /= d) * t) - 1) + b; },
        easeOutCirc: function (_, t, b, c, d) { return c * sqrt(1 - (t = t / d - 1) * t) + b; },
        easeInOutCirc: function (_, t, b, c, d) {
            return (t /= d / 2) < 1
                ? (-c / 2) * (sqrt(1 - t * t) - 1) + b
                : (c / 2) * (sqrt(1 - (t -= 2) * t) + 1) + b;
        },
    };

    var $$ = function (selector) {
        return Array.prototype.slice.call((!selector ? [] : document.querySelectorAll(selector)));
    };
    var $ = function (selector) { return $$(selector).shift() || null; };
    var isElement = function (obj) { return obj instanceof Element; };
    var isWindow = function ($el) { return $el === window; };
    var isRootContainer = function ($el) {
        return $el === document.documentElement || $el === document.body;
    };
    var matches = function ($el, selector) {
        if (isElement(selector)) {
            return $el === selector;
        }
        var results = $$(selector);
        var i = results.length;
        // tslint:disable-next-line no-empty
        while (--i >= 0 && results[i] !== $el) { }
        return i > -1;
    };

    var getHeight = function ($el) {
        return Math.max($el.scrollHeight, $el.clientHeight, $el.offsetHeight);
    };
    var getWidth = function ($el) {
        return Math.max($el.scrollWidth, $el.clientWidth, $el.offsetWidth);
    };
    var getSize = function ($el) { return ({
        width: getWidth($el),
        height: getHeight($el),
    }); };
    var getViewportAndElementSizes = function ($el) {
        var isRoot = isWindow($el) || isRootContainer($el);
        return {
            viewport: {
                width: isRoot
                    ? Math.min(window.innerWidth, document.documentElement.clientWidth)
                    : $el.clientWidth,
                height: isRoot ? window.innerHeight : $el.clientHeight,
            },
            size: isRoot
                ? {
                    width: Math.max(getWidth(document.body), getWidth(document.documentElement)),
                    height: Math.max(getHeight(document.body), getHeight(document.documentElement)),
                }
                : getSize($el),
        };
    };

    var directionMethodMap = {
        y: 'scrollTop',
        x: 'scrollLeft',
    };
    var directionPropMap = {
        y: 'pageYOffset',
        x: 'pageXOffset',
    };
    var getScroll = function ($el, direction) {
        return isWindow($el) ? $el[directionPropMap[direction]] : $el[directionMethodMap[direction]];
    };
    var setScroll = function ($el, offset, direction) {
        if (isWindow($el)) {
            var top_1 = direction === 'y';
            $el.scrollTo(!top_1 ? offset : $el.pageXOffset, top_1 ? offset : $el.pageYOffset);
        }
        else {
            $el[directionMethodMap[direction]] = offset;
        }
    };
    var getOffset = function ($el, $context) {
        var rect = $el.getBoundingClientRect();
        if (rect.width || rect.height) {
            var scroll_1 = { top: 0, left: 0 };
            var $ctx = void 0;
            if (isWindow($context) || isRootContainer($context)) {
                $ctx = document.documentElement;
                scroll_1.top = window[directionPropMap.y];
                scroll_1.left = window[directionPropMap.x];
            }
            else {
                $ctx = $context;
                var cRect = $ctx.getBoundingClientRect();
                scroll_1.top = cRect.top * -1 + $ctx[directionMethodMap.y];
                scroll_1.left = cRect.left * -1 + $ctx[directionMethodMap.x];
            }
            return {
                top: rect.top + scroll_1.top - $ctx.clientTop,
                left: rect.left + scroll_1.left - $ctx.clientLeft,
            };
        }
        return rect;
    };

    var wheelEventName = (function () {
        if (!canUseDOM) {
            return 'wheel';
        }
        return 'onwheel' in document ? 'wheel' : 'mousewheel';
    })();
    var eventName = function (name) { return (name === 'wheel' ? wheelEventName : name); };
    var apply = function ($el, method, event, listener, passive) {
        event.split(' ').forEach(function (name) {
            $el[method](eventName(name), listener, canUsePassiveOption ? { passive: passive } : false);
        });
    };
    var addEvent = function ($el, event, listener, passive) { return apply($el, 'addEventListener', event, listener, passive); };
    var removeEvent = function ($el, event, listener, passive) { return apply($el, 'removeEventListener', event, listener, passive); };

    var reRelativeToken = /^(\+|-)=(\d+(?:\.\d+)?)$/;
    var parseCoordinate = function (coordinate, enableVertical) {
        var res = { top: 0, left: 0, relative: false };
        // Object ({ top: {n}, left: {n} })
        if (hasProp(coordinate, 'top') || hasProp(coordinate, 'left')) {
            res = __assign({}, res, coordinate);
            // Array ([{n}, [{n}])
        }
        else if (isArray(coordinate)) {
            if (coordinate.length > 1) {
                res.top = coordinate[0];
                res.left = coordinate[1];
            }
            else if (coordinate.length === 1) {
                res.top = enableVertical ? coordinate[0] : 0;
                res.left = !enableVertical ? coordinate[0] : 0;
            }
            else {
                return null;
            }
            // Number
        }
        else if (isNumeric(coordinate)) {
            if (enableVertical) {
                res.top = coordinate;
            }
            else {
                res.left = coordinate;
            }
            // String ('+={n}', '-={n}')
        }
        else if (isString(coordinate)) {
            var m = coordinate.trim().match(reRelativeToken);
            if (!m) {
                return null;
            }
            var op = m[1];
            var val = parseInt(m[2], 10);
            if (op === '+') {
                res.top = enableVertical ? val : 0;
                res.left = !enableVertical ? val : 0;
            }
            else {
                res.top = enableVertical ? -val : 0;
                res.left = !enableVertical ? -val : 0;
            }
            res.relative = true;
        }
        else {
            return null;
        }
        return res;
    };

    var defaultOptions = {
        trigger: '[data-scroll]',
        header: '[data-scroll-header]',
        duration: 1000,
        easing: 'easeOutQuint',
        offset: 0,
        vertical: true,
        horizontal: false,
        cancellable: true,
        updateURL: false,
        preventDefault: true,
        stopPropagation: true,
        // Callbacks
        before: null,
        after: null,
        cancel: null,
        complete: null,
        step: null,
    };

    var CONTAINER_CLICK_EVENT = 'click';
    var CONTAINER_STOP_EVENT = 'wheel touchstart touchmove';
    var SweetScroll = /** @class */ (function () {
        /**
         * Constructor
         */
        function SweetScroll(options, container) {
            var _this = this;
            this.$el = null;
            this.ctx = {
                $trigger: null,
                opts: null,
                progress: false,
                pos: null,
                startPos: null,
                easing: null,
                start: 0,
                id: 0,
                cancel: false,
                hash: null,
            };
            /**
             * Handle each frame of the animation.
             */
            this.loop = function (time) {
                var _a = _this, $el = _a.$el, ctx = _a.ctx;
                if (!ctx.start) {
                    ctx.start = time;
                }
                if (!ctx.progress || !$el) {
                    _this.stop();
                    return;
                }
                var options = ctx.opts;
                var offset = ctx.pos;
                var start = ctx.start;
                var startOffset = ctx.startPos;
                var easing = ctx.easing;
                var duration = options.duration;
                var directionMap = { top: 'y', left: 'x' };
                var timeElapsed = time - start;
                var t = Math.min(1, Math.max(timeElapsed / duration, 0));
                Object.keys(offset).forEach(function (key) {
                    var value = offset[key];
                    var initial = startOffset[key];
                    var delta = value - initial;
                    if (delta !== 0) {
                        var val = easing(t, duration * t, 0, 1, duration);
                        setScroll($el, Math.round(initial + delta * val), directionMap[key]);
                    }
                });
                if (timeElapsed <= duration) {
                    _this.hook(options, 'step', t);
                    ctx.id = SweetScroll.raf(_this.loop);
                }
                else {
                    _this.stop(true);
                }
            };
            /**
             * Handling of container click event.
             */
            this.handleClick = function (e) {
                var opts = _this.opts;
                var $el = e.target;
                for (; $el && $el !== document; $el = $el.parentNode) {
                    if (!matches($el, opts.trigger)) {
                        continue;
                    }
                    var dataOptions = JSON.parse($el.getAttribute('data-scroll-options') || '{}');
                    var data = $el.getAttribute('data-scroll');
                    var to = data || $el.getAttribute('href');
                    var options = __assign({}, opts, dataOptions);
                    var preventDefault = options.preventDefault, stopPropagation = options.stopPropagation, vertical = options.vertical, horizontal = options.horizontal;
                    if (preventDefault) {
                        e.preventDefault();
                    }
                    if (stopPropagation) {
                        e.stopPropagation();
                    }
                    // Passes the trigger element to callback
                    _this.ctx.$trigger = $el;
                    if (horizontal && vertical) {
                        _this.to(to, options);
                    }
                    else if (vertical) {
                        _this.toTop(to, options);
                    }
                    else if (horizontal) {
                        _this.toLeft(to, options);
                    }
                    break;
                }
            };
            /**
             * Handling of container stop events.
             */
            this.handleStop = function (e) {
                var ctx = _this.ctx;
                var opts = ctx.opts;
                if (opts && opts.cancellable) {
                    ctx.cancel = true;
                    _this.stop();
                }
                else {
                    e.preventDefault();
                }
            };
            this.opts = __assign({}, defaultOptions, (options || {}));
            var $container = null;
            if (canUseDOM) {
                if (typeof container === 'string') {
                    $container = $(container);
                }
                else if (container != null) {
                    $container = container;
                }
                else {
                    $container = window;
                }
            }
            this.$el = $container;
            if ($container) {
                this.bind(true, false);
            }
        }
        /**
         * SweetScroll instance factory.
         */
        SweetScroll.create = function (options, container) {
            return new SweetScroll(options, container);
        };
        /**
         * Scroll animation to the specified position.
         */
        SweetScroll.prototype.to = function (distance, options) {
            if (!canUseDOM) {
                return;
            }
            var _a = this, $el = _a.$el, ctx = _a.ctx, currentOptions = _a.opts;
            var $trigger = ctx.$trigger;
            var opts = __assign({}, currentOptions, (options || {}));
            var optOffset = opts.offset, vertical = opts.vertical, horizontal = opts.horizontal;
            var $header = isElement(opts.header) ? opts.header : $(opts.header);
            var reg = /^#/;
            var hash = isString(distance) && reg.test(distance) ? distance : null;
            ctx.opts = opts; // Temporary options
            ctx.cancel = false; // Disable the call flag of `cancel`
            ctx.hash = hash;
            // Stop current animation
            this.stop();
            // Does not move if the container is not found
            if (!$el) {
                return;
            }
            // Get scroll offset
            var offset = parseCoordinate(optOffset, vertical);
            var coordinate = parseCoordinate(distance, vertical);
            var scroll = { top: 0, left: 0 };
            if (coordinate) {
                if (coordinate.relative) {
                    var current = getScroll($el, vertical ? 'y' : 'x');
                    scroll.top = vertical ? current + coordinate.top : coordinate.top;
                    scroll.left = !vertical ? current + coordinate.left : coordinate.left;
                }
                else {
                    scroll = coordinate;
                }
            }
            else if (isString(distance) && distance !== '#') {
                var $target = $(distance);
                if (!$target) {
                    return;
                }
                scroll = getOffset($target, $el);
            }
            if (offset) {
                scroll.top += offset.top;
                scroll.left += offset.left;
            }
            if ($header) {
                scroll.top = Math.max(0, scroll.top - getSize($header).height);
            }
            // Normalize scroll offset
            var _b = getViewportAndElementSizes($el), viewport = _b.viewport, size = _b.size;
            scroll.top = vertical
                ? Math.max(0, Math.min(size.height - viewport.height, scroll.top))
                : getScroll($el, 'y');
            scroll.left = horizontal
                ? Math.max(0, Math.min(size.width - viewport.width, scroll.left))
                : getScroll($el, 'x');
            // Call `before`
            // Stop scrolling when it returns false
            if (this.hook(opts, 'before', scroll, $trigger) === false) {
                ctx.opts = null;
                return;
            }
            // Set offset
            ctx.pos = scroll;
            // Run animation!!
            this.start(opts);
            // Bind stop events
            this.bind(false, true);
        };
        /**
         * Scroll animation to specified left position.
         */
        SweetScroll.prototype.toTop = function (distance, options) {
            this.to(distance, __assign({}, (options || {}), { vertical: true, horizontal: false }));
        };
        /**
         * Scroll animation to specified top position.
         */
        SweetScroll.prototype.toLeft = function (distance, options) {
            this.to(distance, __assign({}, (options || {}), { vertical: false, horizontal: true }));
        };
        /**
         * Scroll animation to specified element.
         */
        SweetScroll.prototype.toElement = function ($element, options) {
            var $el = this.$el;
            if (!canUseDOM || !$el) {
                return;
            }
            this.to(getOffset($element, $el), options || {});
        };
        /**
         * Stop the current scroll animation.
         */
        SweetScroll.prototype.stop = function (gotoEnd) {
            if (gotoEnd === void 0) { gotoEnd = false; }
            var _a = this, $el = _a.$el, ctx = _a.ctx;
            var pos = ctx.pos;
            if (!$el || !ctx.progress) {
                return;
            }
            SweetScroll.caf(ctx.id);
            ctx.progress = false;
            ctx.start = 0;
            ctx.id = 0;
            if (gotoEnd && pos) {
                setScroll($el, pos.left, 'x');
                setScroll($el, pos.top, 'y');
            }
            this.complete();
        };
        /**
         * Update options.
         */
        SweetScroll.prototype.update = function (options) {
            if (this.$el) {
                var opts = __assign({}, this.opts, options);
                this.stop();
                this.unbind(true, true);
                this.opts = opts;
                this.bind(true, false);
            }
        };
        /**
         * Destroy instance.
         */
        SweetScroll.prototype.destroy = function () {
            if (this.$el) {
                this.stop();
                this.unbind(true, true);
                this.$el = null;
            }
        };
        /**
         * Callback methods.
         */
        /* tslint:disable:no-empty */
        SweetScroll.prototype.onBefore = function (_, __) {
            return true;
        };
        SweetScroll.prototype.onStep = function (_) { };
        SweetScroll.prototype.onAfter = function (_, __) { };
        SweetScroll.prototype.onCancel = function () { };
        SweetScroll.prototype.onComplete = function (_) { };
        /* tslint:enable */
        /**
         * Start scrolling animation.
         */
        SweetScroll.prototype.start = function (opts) {
            var ctx = this.ctx;
            ctx.opts = opts;
            ctx.progress = true;
            ctx.easing = isFunction(opts.easing)
                ? opts.easing
                : easings[opts.easing];
            // Update start offset.
            var $container = this.$el;
            var start = {
                top: getScroll($container, 'y'),
                left: getScroll($container, 'x'),
            };
            ctx.startPos = start;
            // Loop
            ctx.id = SweetScroll.raf(this.loop);
        };
        /**
         * Handle the completion of scrolling animation.
         */
        SweetScroll.prototype.complete = function () {
            var _a = this, $el = _a.$el, ctx = _a.ctx;
            var hash = ctx.hash, cancel = ctx.cancel, opts = ctx.opts, pos = ctx.pos, $trigger = ctx.$trigger;
            if (!$el || !opts) {
                return;
            }
            if (hash != null && hash !== window.location.hash) {
                var updateURL = opts.updateURL;
                if (canUseDOM && canUseHistory && updateURL !== false) {
                    window.history[updateURL === 'replace' ? 'replaceState' : 'pushState'](null, '', hash);
                }
            }
            this.unbind(false, true);
            ctx.opts = null;
            ctx.$trigger = null;
            if (cancel) {
                this.hook(opts, 'cancel');
            }
            else {
                this.hook(opts, 'after', pos, $trigger);
            }
            this.hook(opts, 'complete', cancel);
        };
        /**
         * Callback function and method call.
         */
        SweetScroll.prototype.hook = function (options, type) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var _a;
            var callback = options[type];
            var callbackResult;
            var methodResult;
            // callback
            if (isFunction(callback)) {
                callbackResult = callback.apply(this, args.concat([this]));
            }
            // method
            methodResult = (_a = this)["on" + (type[0].toUpperCase() + type.slice(1))].apply(_a, args);
            return callbackResult !== undefined ? callbackResult : methodResult;
        };
        /**
         * Bind events of container element.
         */
        SweetScroll.prototype.bind = function (click, stop) {
            var _a = this, $el = _a.$el, opts = _a.ctx.opts;
            if ($el) {
                if (click) {
                    addEvent($el, CONTAINER_CLICK_EVENT, this.handleClick, false);
                }
                if (stop) {
                    addEvent($el, CONTAINER_STOP_EVENT, this.handleStop, opts ? opts.cancellable : true);
                }
            }
        };
        /**
         * Unbind events of container element.
         */
        SweetScroll.prototype.unbind = function (click, stop) {
            var _a = this, $el = _a.$el, opts = _a.ctx.opts;
            if ($el) {
                if (click) {
                    removeEvent($el, CONTAINER_CLICK_EVENT, this.handleClick, false);
                }
                if (stop) {
                    removeEvent($el, CONTAINER_STOP_EVENT, this.handleStop, opts ? opts.cancellable : true);
                }
            }
        };
        /**
         * You can set Polyfill (or Ponyfill) for browsers that do not support requestAnimationFrame.
         */
        SweetScroll.raf = raf;
        SweetScroll.caf = caf;
        return SweetScroll;
    }());

    return SweetScroll;

}));
