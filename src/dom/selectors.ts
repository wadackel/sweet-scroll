import { isElement } from '../utils/lang';
import { Direction } from './offsets';

export const $$ = (selector: string): Element[] => (
  Array.prototype.slice.call(((!selector ? [] : document.querySelectorAll(selector)) as Element[]))
);

export const $ = (selector: string): Element | null => (
  $$(selector).shift() || null
);

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

export const isRootContainer = ($el: Element): boolean => (
  $el === document.documentElement || $el === document.body
);

export const findScrollable = (selectors: string | Element, direction: Direction): Element | null => {
  const $elements = isElement(selectors) ? [selectors] : $$(selectors);
  const overflowStyleName = `overflow-${direction}`;

  for (let i = 0; i < $elements.length; i += 1) {
    const $el = $elements[i];
    let $result = null;

    if (isRootContainer($el)) {
      $result = $el;
    } else {
      const computedStyle = window.getComputedStyle($el);
      const canScroll = (
        computedStyle[overflowStyleName] === 'auto' ||
        computedStyle[overflowStyleName] === 'scroll');

      if (canScroll) {
        $result = $el;
      }
    }

    if ($result) {
      return $result;
    }
  }

  return null;
};
