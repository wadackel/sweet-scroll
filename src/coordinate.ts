import * as Lang from './utils/lang';
import { Offset } from './dom/offsets';

export interface Coordinate extends Offset {
  relative: boolean;
}

const reRelativeToken = /^(\+|-)=(\d+(?:\.\d+)?)$/;

export const parseCoordinate = (coordinate: any, enableVertical: boolean): Coordinate | null => {
  let res: Coordinate = { top: 0, left: 0, relative: false };

  // Object ({ top: {n}, left: {n} })
  if (Lang.hasProp(coordinate, 'top') || Lang.hasProp(coordinate, 'left')) {
    res = { ...res, ...coordinate };

  // Array ([{n}, [{n}])
  } else if (Lang.isArray(coordinate)) {
    if (coordinate.length > 1) {
      res.top = coordinate[0];
      res.left = coordinate[1];
    } else if (coordinate.length === 1) {
      res.top = enableVertical ? coordinate[0] : 0;
      res.left = !enableVertical ? coordinate[0] : 0;
    } else {
      return null;
    }

  // Number
  } else if (Lang.isNumeric(coordinate)) {
    if (enableVertical) {
      res.top = coordinate;
    } else {
      res.left = coordinate;
    }

  // String ('+={n}', '-={n}')
  } else if (Lang.isString(coordinate)) {
    const m = coordinate.trim().match(reRelativeToken);
    if (!m) {
      return null;
    }

    const op = m[1];
    const val = parseInt(m[2], 10);
    if (op === '+') {
      res.top = enableVertical ? val : 0;
      res.left = !enableVertical ? val : 0;
    } else {
      res.top = enableVertical ? -val : 0;
      res.left = !enableVertical ? -val : 0;
    }
    res.relative = true;

  } else {
    return null;
  }

  return res;
};
