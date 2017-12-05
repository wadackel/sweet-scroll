import { isRootContainer } from './selectors';

export interface Size {
  width: number;
  height: number;
}

const getHeight = ($el: HTMLElement): number => (
  Math.max($el.scrollHeight, $el.clientHeight, $el.offsetHeight)
);

const getWidth = ($el: HTMLElement): number => (
  Math.max($el.scrollWidth, $el.clientWidth, $el.offsetWidth)
);

export const getSize = ($el: HTMLElement): Size => ({
  width: getWidth($el),
  height: getHeight($el),
});

export const getViewportAndElementSizes = ($el: HTMLElement): { viewport: Size, size: Size } => {
  const isRoot = isRootContainer($el);

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
