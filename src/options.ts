/* tslint:disable max-line-length */
import { EasingFunction } from './animation/easings';
import { Offset } from './dom/offsets';
import SweetScroll from './index';

export interface BeforeHandler {
  (offset: Offset, $trigger: Element | null, scroller: SweetScroll): boolean | void;
}

export interface AfterHandler {
  (offset: Offset, $trigger: Element | null, scroller: SweetScroll): void;
}

export interface StepHandler {
  (time: number, scroller: SweetScroll): void;
}

export interface CancelHandler {
  (scroller: SweetScroll): void;
}

export interface CompleteHandler {
  (isCancel: boolean, scroller: SweetScroll): void;
}

export interface Options {
  trigger: string;
  header: string | Element;
  duration: number;
  easing: string | EasingFunction;
  offset: number;
  vertical: boolean;
  horizontal: boolean;
  cancellable: boolean;
  updateURL: boolean | string;
  preventDefault: boolean;
  stopPropagation: boolean;
  quickMode: boolean;

  before: BeforeHandler | null;
  after: AfterHandler | null;
  step: StepHandler | null;
  cancel: CancelHandler | null;
  complete: CompleteHandler | null;
}

export interface PartialOptions extends Partial<Options> {}

export const defaultOptions: Options = {
  trigger: '[data-scroll]',       // Selector for trigger (must be a valid css selector)
  header: '[data-scroll-header]', // Selector or Element for fixed header (Selector of must be a valid css selector)
  duration: 1000,                 // Specifies animation duration in integer
  easing: 'easeOutQuint',         // Specifies the pattern of easing
  offset: 0,                      // Specifies the value to offset the scroll position in pixels
  vertical: true,                 // Enable the vertical scroll
  horizontal: false,              // Enable the horizontal scroll
  cancellable: true,              // When fired wheel or touchstart events to stop scrolling
  updateURL: false,               // Update the URL hash on after scroll (true | false | 'push' | 'replace')
  preventDefault: true,           // Cancels the container element click event
  stopPropagation: true,          // Prevents further propagation of the container element click event in the bubbling phase
  quickMode: false,               // Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)

  // Callbacks
  before: null,
  after: null,
  cancel: null,
  complete: null,
  step: null,
};
