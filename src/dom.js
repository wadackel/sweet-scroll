import * as Util from "./utils"

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

export function getOffset(el, direction = "x") {
  // @TODO
}

export function setOffset(el, offsetX = null, offsetY = null) {
  // @TODO
}