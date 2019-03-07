import { ScrollableElement } from '../types';
import { isRootContainer, isWindow } from './selectors';

export interface Offset {
  top: number;
  left: number;
}

export type Direction = 'x' | 'y';

export const directionMethodMap: { [P in Direction]: 'scrollTop' | 'scrollLeft' } = {
  y: 'scrollTop',
  x: 'scrollLeft',
};

export const directionPropMap: { [P in Direction]: 'pageXOffset' | 'pageYOffset' } = {
  y: 'pageYOffset',
  x: 'pageXOffset',
};

export const getScroll = ($el: ScrollableElement, direction: Direction): number =>
  isWindow($el) ? $el[directionPropMap[direction]] : $el[directionMethodMap[direction]];

export const setScroll = ($el: ScrollableElement, offset: number, direction: Direction): void => {
  if (isWindow($el)) {
    const top = direction === 'y';
    $el.scrollTo(!top ? offset : $el.pageXOffset, top ? offset : $el.pageYOffset);
  } else {
    $el[directionMethodMap[direction]] = offset;
  }
};

export const getOffset = ($el: Element, $context: ScrollableElement): Offset => {
  const rect = $el.getBoundingClientRect();

  if (rect.width || rect.height) {
    const scroll = { top: 0, left: 0 };
    let $ctx;

    if (isWindow($context) || isRootContainer($context)) {
      $ctx = document.documentElement;
      scroll.top = window[directionPropMap.y];
      scroll.left = window[directionPropMap.x];
    } else {
      $ctx = $context;
      const cRect = $ctx.getBoundingClientRect();
      scroll.top = cRect.top * -1 + $ctx[directionMethodMap.y];
      scroll.left = cRect.left * -1 + $ctx[directionMethodMap.x];
    }

    return {
      top: rect.top + scroll.top - $ctx.clientTop,
      left: rect.left + scroll.left - $ctx.clientLeft,
    };
  }

  return rect;
};
