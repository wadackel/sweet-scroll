export function $(selector, context = null) {
  if (!selector) return;

  return (context == null ? document : context).querySelector(selector);
}

export function $$(selector, context = null) {
  if (!selector) return;

  return (context == null ? document : context).querySelectorAll(selector);
}

export function matches(el, selector) {
  const results = (el.document || el.ownerDocument).querySelectorAll(selector);
  let i = results.length;
  while (--i >= 0 && results.item(i) !== el);

  return i > -1;
}
