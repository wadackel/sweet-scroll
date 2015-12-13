export function $(selector, context = null) {
  if (!selector) return;
  return (context == null ? document : context).querySelector(selector);
}

export function $$(selector, context = null) {
  if (!selector) return;
  return (context == null ? document : context).querySelectorAll(selector);
}

export function matches(el, selector) {
  const matches = (el.document || el.ownerDocument).querySelectorAll(selector);
  let i = matches.length;
  while (--i >= 0 && matches.item(i) !== el);
  return i > -1;
}
