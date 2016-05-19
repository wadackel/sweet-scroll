import { $$ } from "./selectors";

const directionMethodMap = {
  y: "scrollTop",
  x: "scrollLeft"
};

const directionPropMap = {
  y: "pageYOffset",
  x: "pageXOffset"
};

export function isRootContainer(el) {
  const doc = document;

  return el === doc.documentElement || el === doc.body;
}

function getScrollable(selectors, direction = "y", all = true) {
  const method = directionMethodMap[direction];
  const elements = selectors instanceof Element ? [selectors] : $$(selectors);
  const scrollables = [];
  const $div = document.createElement("div");

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    if (el[method] > 0) {
      scrollables.push(el);
    } else {
      $div.style.width = `${el.clientWidth + 1}px`;
      $div.style.height = `${el.clientHeight + 1}px`;
      el.appendChild($div);

      el[method] = 1;
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
  return Math.max(el.scrollHeight, el.clientHeight, el.offsetHeight);
}

function getWidth(el) {
  return Math.max(el.scrollWidth, el.clientWidth, el.offsetWidth);
}

export function getSize(el) {
  return {
    width: getWidth(el),
    height: getHeight(el)
  };
}

export function getDocumentSize() {
  return {
    width: Math.max(getWidth(document.body), getWidth(document.documentElement)),
    height: Math.max(getHeight(document.body), getHeight(document.documentElement))
  };
}

export function getViewportAndElementSizes(el) {
  if (isRootContainer(el)) {
    return {
      viewport: {
        width: Math.min(window.innerWidth, document.documentElement.clientWidth),
        height: window.innerHeight
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
  const win = getWindow(el);

  return win ? win[directionPropMap[direction]] : el[directionMethodMap[direction]];
}

export function setScroll(el, offset, direction = "y") {
  const win = getWindow(el);
  const top = direction === "y";
  if (win) {
    win.scrollTo(
      !top ? offset : win[directionPropMap.x],
      top  ? offset : win[directionPropMap.y]
    );
  } else {
    el[directionMethodMap[direction]] = offset;
  }
}

export function getOffset(el, context = null) {
  if (!el || (el && !el.getClientRects().length)) {
    return {
      top: 0,
      left: 0
    };
  }
  const rect = el.getBoundingClientRect();
  if (rect.width || rect.height) {
    const scroll = {};
    let ctx = null;
    if (context == null || isRootContainer(context)) {
      ctx = el.ownerDocument.documentElement;
      scroll.top = window.pageYOffset;
      scroll.left = window.pageXOffset;
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
