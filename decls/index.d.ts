import { RequestAnimationFrame, CancelAnimationFrame } from './animation/requestAnimationFrame';
import { EasingFunction } from './animation/easings';
import { Offset } from './dom/offsets';
import { Options, PartialOptions } from './options';
import { ScrollableElement } from './types';
export { Options, PartialOptions, EasingFunction, Offset, RequestAnimationFrame, CancelAnimationFrame, };
export default class SweetScroll {
    /**
     * You can set Polyfill (or Ponyfill) for browsers that do not support requestAnimationFrame.
     */
    static raf: RequestAnimationFrame;
    static caf: CancelAnimationFrame;
    /**
     * SweetScroll instance factory.
     */
    static create(options?: PartialOptions, container?: string | ScrollableElement): SweetScroll;
    /**
     * Instance properties.
     */
    private opts;
    private $el;
    private ctx;
    /**
     * Constructor
     */
    constructor(options?: PartialOptions, container?: string | ScrollableElement);
    /**
     * Scroll animation to the specified position.
     */
    to(distance: any, options?: PartialOptions): void;
    /**
     * Scroll animation to specified left position.
     */
    toTop(distance: any, options?: PartialOptions): void;
    /**
     * Scroll animation to specified top position.
     */
    toLeft(distance: any, options?: PartialOptions): void;
    /**
     * Scroll animation to specified element.
     */
    toElement($element: Element, options?: PartialOptions): void;
    /**
     * Stop the current scroll animation.
     */
    stop(gotoEnd?: boolean): void;
    /**
     * Update options.
     */
    update(options: PartialOptions): void;
    /**
     * Destroy instance.
     */
    destroy(): void;
    /**
     * Callback methods.
     */
    protected onBefore(_: Offset, __: Element | null): boolean | void;
    protected onStep(_: number): void;
    protected onAfter(_: Offset, __: Element | null): void;
    protected onCancel(): void;
    protected onComplete(_: boolean): void;
    /**
     * Start scrolling animation.
     */
    protected start(opts: Options): void;
    /**
     * Handle each frame of the animation.
     */
    protected loop: (time: number) => void;
    /**
     * Handle the completion of scrolling animation.
     */
    protected complete(): void;
    /**
     * Callback function and method call.
     */
    protected hook(options: Options, type: 'before' | 'after' | 'step' | 'cancel' | 'complete', ...args: any[]): any;
    /**
     * Bind events of container element.
     */
    protected bind(click: boolean, stop: boolean): void;
    /**
     * Unbind events of container element.
     */
    protected unbind(click: boolean, stop: boolean): void;
    /**
     * Handling of container click event.
     */
    protected handleClick: (e: Event) => void;
    /**
     * Handling of container stop events.
     */
    protected handleStop: (e: Event) => void;
}
