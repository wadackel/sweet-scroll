export interface EasingFunction {
    (x: number, t: number, b: number, c: number, d: number, s?: number): number;
}
export interface Easings {
    [name: string]: EasingFunction;
}
export declare const easings: Easings;
