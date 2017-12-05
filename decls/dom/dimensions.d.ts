export interface Size {
    width: number;
    height: number;
}
export declare const getSize: ($el: HTMLElement) => Size;
export declare const getViewportAndElementSizes: ($el: HTMLElement) => {
    viewport: Size;
    size: Size;
};
