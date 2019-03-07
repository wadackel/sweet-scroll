import { ScrollableElement } from '../types';

export const $$ = (selector: string): Element[] =>
  Array.prototype.slice.call((!selector ? [] : document.querySelectorAll(selector)) as Element[]);

export const $ = (selector: string): Element | null => $$(selector).shift() || null;

export const isElement = (obj: any): obj is Element => obj instanceof Element;

export const isWindow = ($el: ScrollableElement): $el is Window => $el === window;

export const isRootContainer = ($el: ScrollableElement): boolean =>
  $el === document.documentElement || $el === document.body;

export const matches = ($el: Element, selector: string | Element): boolean => {
  if (isElement(selector)) {
    return $el === selector;
  }

  const results = $$(selector);
  let i = results.length;

  // tslint:disable-next-line no-empty
  while (--i >= 0 && results[i] !== $el) {}

  return i > -1;
};
