export function $(selector, context = null) {
  return (context == null ? document : context).querySelector(selector);
}

export function $$(selector, context = null) {
  return (context == null ? document : context).querySelectorAll(selector);
}