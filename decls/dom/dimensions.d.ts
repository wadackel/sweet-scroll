import { ScrollableElement } from 'src/types';
export interface Size {
    width: number;
    height: number;
}
export declare const getSize: ($el: HTMLElement) => Size;
export declare const getViewportAndElementSizes: ($el: ScrollableElement) => {
    viewport: Size;
    size: Size;
};
