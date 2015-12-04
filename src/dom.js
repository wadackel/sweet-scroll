import * as Util from "./utils"

export function isRootContainer(el) {
  const doc = document;
  return el === doc.documentElement || el === doc.body;
}

export function setAttributes(el, props) {
  Util.each(props, (value, prop) => {
    el.setAttribute(prop, value);
  });
}

export function getScroll(el, direction = "x") {
  // @TODO
}

export function setScroll(el, offset, direction = "x") {
  // @TODO
}

export function getOffset(el, context = null) {
  if (!el.getClientRects().length) return {top: 0, left: 0};
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
      scroll.top = ctx.scrollTop;
      scroll.left = ctx.scrollLeft;
    }
    return {
      top: rect.top + scroll.top - ctx.clientTop,
      left: rect.left + scroll.left - ctx.clientLeft
    };
  }
  return rect;
}