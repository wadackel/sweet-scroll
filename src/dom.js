import { $$ } from "./selectors";
import { win, doc } from "./elements";
import * as math from "./math";

const directionMethodMap = {
  y: "scrollTop",
  x: "scrollLeft"
};

const directionPropMap = {
  y: "pageYOffset",
  x: "pageXOffset"
};

export function isRootContainer(el) {
  return el === doc.documentElement || el === doc.body;
}

function getZoomLevel() {
  const { outerWidth, innerWidth } = win;

  return outerWidth ? outerWidth / innerWidth : 1;
}

function getScrollable(selectors, direction = "y", all = true) {
  const method = directionMethodMap[direction];
  const elements = selectors instanceof Element ? [selectors] : $$(selectors);
  const scrollables = [];
  const $div = doc.createElement("div");

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    if (el[method] > 0) {
      scrollables.push(el);
    } else {
      $div.style.width = `${el.clientWidth + 1}px`;
      $div.style.height = `${el.clientHeight + 1}px`;
      el.appendChild($div);

      el[method] = 1.5 / getZoomLevel();
      if (el[method] > 0) {
        scrollables.push(el);
      }
      el[method] = 0;

      el.removeChild($div);
    }

    if (!all && scrollables.length > 0) break;
  }

  return scrollables;
}

export function scrollableFind(selectors, direction) {
  const scrollables = getScrollable(selectors, direction, false);

  return scrollables.length >= 1 ? scrollables[0] : null;
}

function getWindow(el) {
  return (el != null && el === el.window) ? el : el.nodeType === 9 && el.defaultView;
}

function getHeight(el) {
  return math.max(el.scrollHeight, el.clientHeight, el.offsetHeight);
}

function getWidth(el) {
  return math.max(el.scrollWidth, el.clientWidth, el.offsetWidth);
}

export function getSize(el) {
  return {
    width: getWidth(el),
    height: getHeight(el)
  };
}

export function getDocumentSize() {
  return {
    width: math.max(getWidth(doc.body), getWidth(doc.documentElement)),
    height: math.max(getHeight(doc.body), getHeight(doc.documentElement))
  };
}

export function getViewportAndElementSizes(el) {
  if (isRootContainer(el)) {
    return {
      viewport: {
        width: math.min(win.innerWidth, doc.documentElement.clientWidth),
        height: win.innerHeight
      },
      size: getDocumentSize()
    };
  }

  return {
    viewport: {
      width: el.clientWidth,
      height: el.clientHeight
    },
    size: getSize(el)
  };
}

export function getScroll(el, direction = "y") {
  const currentWindow = getWindow(el);

  return currentWindow
    ? currentWindow[directionPropMap[direction]]
    : el[directionMethodMap[direction]];
}

export function setScroll(el, offset, direction = "y") {
  const currentWindow = getWindow(el);
  const top = direction === "y";
  if (currentWindow) {
    currentWindow.scrollTo(
      !top ? offset : currentWindow[directionPropMap.x],
      top  ? offset : currentWindow[directionPropMap.y]
    );
  } else {
    el[directionMethodMap[direction]] = offset;
  }
}

export function getOffset(el, context = null) {
  if (!el || (el && !el.getClientRects().length)) {
    return { top: 0, left: 0 };
  }

  const rect = el.getBoundingClientRect();

  if (rect.width || rect.height) {
    const scroll = {};
    let ctx = null;
    if (context == null || isRootContainer(context)) {
      ctx = el.ownerDocument.documentElement;
      scroll.top = win.pageYOffset;
      scroll.left = win.pageXOffset;
    } else {
      ctx = context;
      const ctxRect = ctx.getBoundingClientRect();
      scroll.top = ctxRect.top * -1 + ctx.scrollTop;
      scroll.left = ctxRect.left * -1 + ctx.scrollLeft;
    }

    return {
      top: rect.top + scroll.top - ctx.clientTop,
      left: rect.left + scroll.left - ctx.clientLeft
    };
  }

  return rect;
}
