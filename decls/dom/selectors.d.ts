import { ScrollableElement } from '../types';
export declare const $$: (selector: string) => Element[];
export declare const $: (selector: string) => Element | null;
export declare const isElement: (obj: any) => obj is Element;
export declare const isWindow: ($el: ScrollableElement) => $el is Window;
export declare const isRootContainer: ($el: ScrollableElement) => boolean;
export declare const matches: ($el: Element, selector: string | Element) => boolean;
