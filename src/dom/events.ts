import { canUseDOM, canUsePassiveOption } from '../utils/supports';
import { ScrollableElement } from '../types';

export interface EventListener {
  (e: Event): void;
}

const wheelEventName = (() => {
  if (!canUseDOM) {
    return 'wheel';
  }

  return 'onwheel' in document ? 'wheel' : 'mousewheel';
})();

const eventName = (name: string): string => (name === 'wheel' ? wheelEventName : name);

const apply = (
  $el: ScrollableElement,
  method: string,
  event: string,
  listener: EventListener,
  passive: boolean,
): void => {
  event.split(' ').forEach((name) => {
    ($el as any)[method](eventName(name), listener, canUsePassiveOption ? { passive } : false);
  });
};

export const addEvent = (
  $el: ScrollableElement,
  event: string,
  listener: EventListener,
  passive: boolean,
) => apply($el, 'addEventListener', event, listener, passive);

export const removeEvent = (
  $el: ScrollableElement,
  event: string,
  listener: EventListener,
  passive: boolean,
) => apply($el, 'removeEventListener', event, listener, passive);
