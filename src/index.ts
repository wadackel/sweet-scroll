import { canUseDOM, canUseHistory } from './utils/supports';
import * as Lang from './utils/lang';
import { RequestAnimationFrame, CancelAnimationFrame, raf, caf } from './animation/requestAnimationFrame';
import { easings } from './animation/easings';
import { EasingFunction } from './animation/easings';
import { $, findScrollable, matches } from './dom/selectors';
import { getSize, getViewportAndElementSizes } from './dom/dimensions';
import { getOffset, getScroll, setScroll, Offset } from './dom/offsets';
import { addEvent, removeEvent } from './dom/events';
import { parseCoordinate } from './coordinate';
import {
  Options,
  PartialOptions,
  defaultOptions,
} from './options';

export {
  Options,
  PartialOptions,
  EasingFunction,
  Offset,
  RequestAnimationFrame,
  CancelAnimationFrame,
};

const CONTAINER_CLICK_EVENT = 'click';
const CONTAINER_STOP_EVENT = 'wheel touchstart touchmove';

interface Context {
  $trigger: Element | null;
  opts: Options | null;
  progress: boolean;
  pos: Offset | null;
  startPos: Offset | null;
  easing: EasingFunction | null;
  start: number;
  id: number;
  cancel: boolean;
  hash: string | null;
}

export default class SweetScroll {
  /**
   * You can set Polyfill (or Ponyfill) for browsers that do not support requestAnimationFrame.
   */
  public static raf: RequestAnimationFrame = raf;
  public static caf: CancelAnimationFrame = caf;

  /**
   * SweetScroll instance factory.
   */
  public static create(options?: PartialOptions, container?: string | Element): SweetScroll {
    return new SweetScroll(options, container);
  }

  /**
   * Instance properties.
   */
  private opts: Options;
  private $el: Element | null;
  private ctx: Context = {
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
   * Constructor
   */
  public constructor(options?: PartialOptions, container?: string | Element) {
    const opts = { ...defaultOptions, ...(options || {}) };
    const { vertical, horizontal } = opts;
    const selector = container === undefined ? 'body,html' : container;
    let $container = null;

    if (canUseDOM) {
      if (vertical) {
        $container = findScrollable(selector, 'y');
      }
      if (!$container && horizontal) {
        $container = findScrollable(selector, 'x');
      }
    }

    if ($container) {
      this.opts = opts;
      this.$el = $container;
      this.bind(true, false);
    }
  }

  /**
   * Scroll animation to the specified position.
   */
  public to(distance: any, options?: PartialOptions): void {
    if (!canUseDOM) {
      return;
    }

    const { $el, ctx, opts: currentOptions } = this;
    const { $trigger } = ctx;
    const opts = { ...currentOptions, ...options || {} };
    const { offset: optOffset, vertical, horizontal } = opts;
    const $header = Lang.isElement(opts.header) ? opts.header : $(opts.header);
    const hash = Lang.isString(distance) && /^#/.test(distance) ? distance : null;

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
    const offset = parseCoordinate(optOffset, vertical);
    const coordinate = parseCoordinate(distance, vertical);
    let scroll: Offset = { top: 0, left: 0 };

    if (coordinate) {
      if (coordinate.relative) {
        const current = getScroll($el, vertical ? 'y' : 'x');
        scroll.top = vertical ? current + coordinate.top : coordinate.top;
        scroll.left = !vertical ? current + coordinate.left : coordinate.left;
      } else {
        scroll = coordinate;
      }
    } else if (Lang.isString(distance) && distance !== '#') {
      const $target = $(distance);
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
      scroll.top = Math.max(0, scroll.top - getSize(($header as HTMLElement)).height);
    }

    // Normalize scroll offset
    const { viewport, size } = getViewportAndElementSizes(($el as HTMLElement));

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
  }

  /**
   * Scroll animation to specified left position.
   */
  public toTop(distance: any, options?: PartialOptions): void {
    this.to(distance, {
      ...options || {},
      vertical: true,
      horizontal: false,
    });
  }

  /**
   * Scroll animation to specified top position.
   */
  public toLeft(distance: any, options?: PartialOptions): void {
    this.to(distance, {
      ...options || {},
      vertical: false,
      horizontal: true,
    });
  }

  /**
   * Scroll animation to specified element.
   */
  public toElement($element: Element, options?: PartialOptions): void {
    const { $el } = this;

    if (!canUseDOM || !$el) {
      return;
    }

    this.to(getOffset($element, $el), options || {});
  }

  /**
   * Stop the current scroll animation.
   */
  public stop(gotoEnd: boolean = false): void {
    const { $el, ctx } = this;
    const { pos } = ctx;

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
  }

  /**
   * Update options.
   */
  public update(options: PartialOptions): void {
    if (this.$el) {
      const opts = { ...this.opts, ...options };
      this.stop();
      this.unbind(true, true);
      this.opts = opts;
      this.bind(true, false);
    }
  }

  /**
   * Destroy instance.
   */
  public destroy(): void {
    if (this.$el) {
      this.stop();
      this.unbind(true, true);
      this.$el = null;
    }
  }

  /**
   * Callback methods.
   */
  /* tslint:disable:no-empty */
  protected onBefore(_: Offset, __: Element | null): boolean | void { return true; }
  protected onStep(_: number): void {}
  protected onAfter(_: Offset, __: Element | null): void {}
  protected onCancel(): void {}
  protected onComplete(_: boolean): void {}
  /* tslint:enable */

  /**
   * Start scrolling animation.
   */
  protected start(opts: Options): void {
    const { ctx } = this;

    ctx.opts = opts;
    ctx.progress = true;
    ctx.easing = Lang.isFunction(opts.easing)
      ? (opts.easing as EasingFunction)
      : easings[(opts.easing as string)];

    // Update start offset.
    const $container = (this.$el as Element);
    const offset = (ctx.pos as Offset);
    const start = {
      top: getScroll($container, 'y'),
      left: getScroll($container, 'x'),
    };

    if (opts.quickMode) {
      const { viewport: { width, height } } = getViewportAndElementSizes(($container as HTMLElement));

      if (Math.abs(start.top - offset.top) > height) {
        start.top = start.top > offset.top ? offset.top + height : offset.top - height;
      }

      if (Math.abs(start.left - offset.left) > width) {
        start.left = start.left > offset.left ? offset.left + width : offset.left - width;
      }
    }

    ctx.startPos = start;

    // Loop
    ctx.id = SweetScroll.raf(this.loop);
  }

  /**
   * Handle each frame of the animation.
   */
  protected loop = (time: number): void => {
    const { $el, ctx } = this;

    if (!ctx.start) {
      ctx.start = time;
    }

    if (!ctx.progress || !$el) {
      this.stop();
      return;
    }

    const options = (ctx.opts as Options);
    const offset = (ctx.pos as Offset);
    const start = ctx.start;
    const startOffset = (ctx.startPos as Offset);
    const easing = (ctx.easing as EasingFunction);
    const { duration } = options;
    const directionMap = { top: 'y', left: 'x' };
    const timeElapsed = time - start;
    const t = Math.min(1, Math.max(timeElapsed / duration, 0));

    Object.keys(offset).forEach((key) => {
      const value = offset[key];
      const initial = startOffset[key];
      const delta = value - initial;
      if (delta !== 0) {
        const val = easing(t, duration * t, 0, 1, duration);
        setScroll($el, Math.round(initial + delta * val), directionMap[key]);
      }
    });

    if (timeElapsed <= duration) {
      this.hook(options, 'step', t);
      ctx.id = SweetScroll.raf(this.loop);
    } else {
      this.stop(true);
    }
  }

  /**
   * Handle the completion of scrolling animation.
   */
  protected complete(): void {
    const { $el, ctx } = this;
    const { hash, cancel, opts, pos, $trigger } = ctx;

    if (!$el || !opts) {
      return;
    }

    if (hash != null && hash !== window.location.hash) {
      const { updateURL } = opts;
      if (canUseDOM && canUseHistory && updateURL !== false) {
        window.history[updateURL === 'replace' ? 'replaceState' : 'pushState'](null, '', hash);
      }
    }

    this.unbind(false, true);

    ctx.opts = null;
    ctx.$trigger = null;

    if (cancel) {
      this.hook(opts, 'cancel');
    } else {
      this.hook(opts, 'after', pos, $trigger);
    }

    this.hook(opts, 'complete', cancel);
  }

  /**
   * Callback function and method call.
   */
  protected hook(options: Options, type: string, ...args: any[]): any {
    const callback = options[type];
    let callbackResult: any;
    let methodResult: any;

    // callback
    if (Lang.isFunction(callback)) {
      callbackResult = callback.apply(this, [...args, this]);
    }

    // method
    methodResult = this[`on${type[0].toUpperCase() + type.slice(1)}`](...args);

    return callbackResult !== undefined ? callbackResult : methodResult;
  }

  /**
   * Bind events of container element.
   */
  protected bind(click: boolean, stop: boolean): void {
    const { $el, ctx: { opts } } = this;
    if ($el) {
      if (click) {
        addEvent($el, CONTAINER_CLICK_EVENT, this.handleClick, false);
      }
      if (stop) {
        addEvent($el, CONTAINER_STOP_EVENT, this.handleStop, opts ? opts.cancellable : true);
      }
    }
  }

  /**
   * Unbind events of container element.
   */
  protected unbind(click: boolean, stop: boolean): void {
    const { $el, ctx: { opts } } = this;
    if ($el) {
      if (click) {
        removeEvent($el, CONTAINER_CLICK_EVENT, this.handleClick, false);
      }
      if (stop) {
        removeEvent($el, CONTAINER_STOP_EVENT, this.handleStop, opts ? opts.cancellable : true);
      }
    }
  }

  /**
   * Handling of container click event.
   */
  protected handleClick = (e: Event) => {
    const { opts } = this;
    let $el: any = (e.target as any);

    for (; $el && $el !== document; $el = $el.parentNode) {
      if (!matches($el, opts.trigger)) {
        continue;
      }

      const dataOptions = JSON.parse($el.getAttribute('data-scroll-options') || '{}');
      const data = $el.getAttribute('data-scroll');
      const to = data || $el.getAttribute('href');
      const options = { ...opts, ...dataOptions };
      const { preventDefault, stopPropagation, vertical, horizontal } = options;

      if (preventDefault) {
        e.preventDefault();
      }

      if (stopPropagation) {
        e.stopPropagation();
      }

      // Passes the trigger element to callback
      this.ctx.$trigger = $el;

      if (horizontal && vertical) {
        this.to(to, (options as PartialOptions));
      } else if (vertical) {
        this.toTop(to, (options as PartialOptions));
      } else if (horizontal) {
        this.toLeft(to, (options as PartialOptions));
      }
    }
  }

  /**
   * Handling of container stop events.
   */
  protected handleStop = (e: Event) => {
    const { ctx } = this;
    const { opts } = ctx;

    if (opts && opts.cancellable) {
      ctx.cancel = true;
      this.stop();
    } else {
      e.preventDefault();
    }
  }
}
