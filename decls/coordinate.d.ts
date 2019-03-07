import { Offset } from './dom/offsets';
export interface Coordinate extends Offset {
    relative: boolean;
}
export declare const parseCoordinate: (coordinate: any, enableVertical: boolean) => Coordinate | null;
