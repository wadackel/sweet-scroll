export interface RequestAnimationFrame {
    (callback: (time: number) => void): number;
}
export interface CancelAnimationFrame {
    (handle: number): void;
}
export declare const raf: RequestAnimationFrame;
export declare const caf: CancelAnimationFrame;
