import { isElement } from '../utils/lang';
import { directionMethodMap, Direction } from './offsets';

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
  const method = directionMethodMap[direction];
  const $elements = isElement(selectors) ? [selectors] : $$(selectors);
  const $div = document.createElement('div');

  for (let i = 0; i < $elements.length; i += 1) {
    const $el = $elements[i];
    let $result = null;

    if ($el[method] > 0) {
      $result = $el;
    } else {
      const { outerWidth, innerWidth } = window;
      const zoom = outerWidth ? outerWidth / innerWidth : 1;
      $div.style.width = `${$el.clientWidth + 1}px`;
      $div.style.height = `${$el.clientHeight + 1}px`;
      $el.appendChild($div);
      $el[method] = 1.5 / zoom;
      if ($el[method] > 0) {
        $result = $el;
      }
      $el[method] = 0;
      $el.removeChild($div);
    }

    if ($result) {
      return $result;
    }
  }

  return null;
};
