import { ScrollableElement } from '../types';
export interface Offset {
    top: number;
    left: number;
}
export declare type Direction = 'x' | 'y';
export declare const directionMethodMap: {
    [P in Direction]: 'scrollTop' | 'scrollLeft';
};
export declare const directionPropMap: {
    [P in Direction]: 'pageXOffset' | 'pageYOffset';
};
export declare const getScroll: ($el: ScrollableElement, direction: Direction) => number;
export declare const setScroll: ($el: ScrollableElement, offset: number, direction: Direction) => void;
export declare const getOffset: ($el: Element, $context: ScrollableElement) => Offset;
