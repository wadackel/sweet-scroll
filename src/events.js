export function addEvent(el, event, listener) {
  const events = event.split(",");
  events.forEach(eventName => {
    el.addEventListener(eventName.trim(), listener, false);
  });
}

export function removeEvent(el, event, listener) {
  const events = event.split(",");
  events.forEach(eventName => {
    el.removeEventListener(eventName.trim(), listener, false);
  });
}
