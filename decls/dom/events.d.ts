export interface EventListener {
    (e: Event): void;
}
export declare const addEvent: ($el: Element, event: string, listener: EventListener, passive: boolean) => void;
export declare const removeEvent: ($el: Element, event: string, listener: EventListener, passive: boolean) => void;
