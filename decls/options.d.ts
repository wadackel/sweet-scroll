import { EasingFunction } from './animation/easings';
import { Offset } from './dom/offsets';
import SweetScroll from './index';
export interface BeforeHandler {
    (offset: Offset, $trigger: Element | null, scroller: SweetScroll): boolean | void;
}
export interface AfterHandler {
    (offset: Offset, $trigger: Element | null, scroller: SweetScroll): void;
}
export interface StepHandler {
    (time: number, scroller: SweetScroll): void;
}
export interface CancelHandler {
    (scroller: SweetScroll): void;
}
export interface CompleteHandler {
    (isCancel: boolean, scroller: SweetScroll): void;
}
export interface Options {
    trigger: string;
    header: string | Element;
    duration: number;
    easing: string | EasingFunction;
    offset: number;
    vertical: boolean;
    horizontal: boolean;
    cancellable: boolean;
    updateURL: boolean | string;
    preventDefault: boolean;
    stopPropagation: boolean;
    before: BeforeHandler | null;
    after: AfterHandler | null;
    step: StepHandler | null;
    cancel: CancelHandler | null;
    complete: CompleteHandler | null;
}
export interface PartialOptions extends Partial<Options> {
}
export declare const defaultOptions: Options;
