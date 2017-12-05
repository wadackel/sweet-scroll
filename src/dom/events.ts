import { canUseDOM, canUsePassiveOption } from '../utils/supports';

export interface EventListener {
  (e: Event): void;
}

const wheelEventName = (() => {
  if (!canUseDOM) {
    return 'wheel';
  }

  return 'onwheel' in document ? 'wheel' : 'mousewheel';
})();

const eventName = (name: string): string => (
  name === 'wheel' ? wheelEventName : name
);

const apply = ($el: Element, method: string, event: string, listener: EventListener, passive: boolean): void => {
  event.split(' ').forEach((name) => {
    $el[method](eventName(name), listener, canUsePassiveOption ? { passive } : false);
  });
};

export const addEvent = ($el: Element, event: string, listener: EventListener, passive: boolean): void => {
  apply($el, 'addEventListener', event, listener, passive);
};

export const removeEvent = ($el: Element, event: string, listener: EventListener, passive: boolean): void => {
  apply($el, 'removeEventListener', event, listener, passive);
};
