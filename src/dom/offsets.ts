import { isRootContainer } from './selectors';

export interface Offset {
  top: number;
  left: number;
}

export type Direction = 'x' | 'y';

export const directionMethodMap = {
  y: 'scrollTop',
  x: 'scrollLeft',
};

export const directionPropMap = {
  y: 'pageYOffset',
  x: 'pageXOffset',
};

export const getScroll = ($el: Element, direction: Direction): number => (
  $el[directionMethodMap[direction]]
);

export const setScroll = ($el: Element, offset: number, direction: Direction): void => {
  $el[directionMethodMap[direction]] = offset;
};

export const getOffset = ($el: Element, $context: Element): Offset => {
  const rect = $el.getBoundingClientRect();

  if (rect.width || rect.height) {
    const scroll = { top: 0, left: 0 };
    let $ctx;

    if (isRootContainer($context)) {
      $ctx = document.documentElement;
      scroll.top = window[directionPropMap.y];
      scroll.left = window[directionPropMap.x];
    } else {
      $ctx = $context;
      const cRect = $ctx.getBoundingClientRect();
      scroll.top = (cRect.top * -1) + $ctx[directionMethodMap.y];
      scroll.left = (cRect.left * -1) + $ctx[directionMethodMap.x];
    }

    return {
      top: (rect.top + scroll.top) - $ctx.clientTop,
      left: (rect.left + scroll.left) - $ctx.clientLeft,
    };
  }

  return rect;
};
