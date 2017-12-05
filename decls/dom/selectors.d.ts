import { Direction } from './offsets';
export declare const $$: (selector: string) => Element[];
export declare const $: (selector: string) => Element | null;
export declare const matches: ($el: Element, selector: string | Element) => boolean;
export declare const isRootContainer: ($el: Element) => boolean;
export declare const findScrollable: (selectors: string | Element, direction: Direction) => Element | null;
