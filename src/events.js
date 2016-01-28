export function addEvent(el, event, listener) {
  el.addEventListener(event, listener, false);
}

export function removeEvent(el, event, listener) {
  el.removeEventListener(event, listener, false);
}
