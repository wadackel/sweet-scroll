import {$$} from "./selectors";

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
  const elements = $$(selectors);
  const scrollables = [];
  const $div = document.createElement("div");

  for ( let i = 0; i < elements.length; i++ ) {
    let el = elements[i];

    if( el[method] > 0 ) {
      scrollables.push(el);

    } else {
      $div.style.width = `${el.clientWidth + 1}px`;
      $div.style.height = `${el.clientHeight + 1}px`;
      el.appendChild($div);

      el[method] = 1;
      if( el[method] > 0 ) {
        scrollables.push(el);
      }
      el[method] = 0;

      el.removeChild($div);
    }

    if ( !all && scrollables.length > 0 ) break;
  }

  return scrollables;
}

export function scrollableFind(selectors, direction) {
  const scrollables = getScrollable(selectors, direction, false);
  return scrollables.length >= 1 ? scrollables[0] : undefined;
}

function getWindow(el) {
  return (el != null && el === el.window) ? el : el.nodeType === 9 && el.defaultView;
}

export function getScroll(el, direction = "y") {
  const method = directionMethodMap[direction];
  const prop = directionPropMap[direction];
  const win = getWindow(el);
  return win ? win[prop] : el[method];
}

export function setScroll(el, offset, direction = "y") {
  const method = directionMethodMap[direction];
  const win = getWindow(el);
  const top = direction === "y";
  if (win) {
    win.scrollTo(
      !top ? offset : win.pageXOffset,
      top ? offset : win.pageYOffset
    );
  } else {
    el[method] = offset;
  }
}

export function getOffset(el, context = null) {
  if (!el || (el && !el.getClientRects().length)) {
    return {top: 0, left: 0};
  }
  const rect = el.getBoundingClientRect();
  if (rect.width || rect.height) {
    const scroll = {};
    let ctx;
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
