import { canUseDOM } from '../utils/supports';

export interface RequestAnimationFrame {
  (callback: (time: number) => void): number;
}

export interface CancelAnimationFrame {
  (handle: number): void;
}

export const raf: RequestAnimationFrame = canUseDOM ? window.requestAnimationFrame.bind(window) : null;
export const caf: CancelAnimationFrame = canUseDOM ? window.cancelAnimationFrame.bind(window) : null;
