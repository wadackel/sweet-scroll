import { ScrollableElement } from '../types';
export interface EventListener {
    (e: Event): void;
}
export declare const addEvent: ($el: ScrollableElement, event: string, listener: EventListener, passive: boolean) => void;
export declare const removeEvent: ($el: ScrollableElement, event: string, listener: EventListener, passive: boolean) => void;
