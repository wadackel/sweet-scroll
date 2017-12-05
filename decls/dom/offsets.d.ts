export interface Offset {
    top: number;
    left: number;
}
export declare type Direction = 'x' | 'y';
export declare const directionMethodMap: {
    y: string;
    x: string;
};
export declare const directionPropMap: {
    y: string;
    x: string;
};
export declare const getScroll: ($el: Element, direction: Direction) => number;
export declare const setScroll: ($el: Element, offset: number, direction: Direction) => void;
export declare const getOffset: ($el: Element, $context: Element) => Offset;
