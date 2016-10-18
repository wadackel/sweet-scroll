import { pow } from "./math";

const MAX_ARRAY_INDEX = pow(2, 53) - 1;
const classTypeList = ["Boolean", "Number", "String", "Function", "Array", "Object"];
const classTypes = {};

classTypeList.forEach(name => {
  classTypes[`[object ${name}]`] = name.toLowerCase();
});

export function getType(obj) {
  if (obj == null) {
    return "";
  }

  return typeof obj === "object" || typeof obj === "function"
    ?  classTypes[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}

export function isNumber(obj) {
  return getType(obj) === "number";
}

export function isString(obj) {
  return getType(obj) === "string";
}

export function isBoolean(obj) {
  return getType(obj) === "boolean";
}

export function isFunction(obj) {
  return getType(obj) === "function";
}

export function isArray(obj) {
  return Array.isArray(obj);
}

export function isArrayLike(obj) {
  const length = obj == null ? null : obj.length;

  return isNumber(length) && length >= 0 && length <= MAX_ARRAY_INDEX;
}

export function isNumeric(obj) {
  return !isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
}

export function isObject(obj) {
  return !isArray(obj) && getType(obj) === "object";
}

export function hasProp(obj, key) {
  return obj && obj.hasOwnProperty(key);
}

export function keys(obj) {
  return Object.keys(obj);
}

export function each(obj, iterate, context) {
  if (obj == null) return obj;

  const ctx = context || obj;

  if (isObject(obj)) {
    for (const key in obj) {
      if (!hasProp(obj, key)) continue;
      if (iterate.call(ctx, obj[key], key) === false) break;
    }
  } else if (isArrayLike(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (iterate.call(ctx, obj[i], i) === false) break;
    }
  }

  return obj;
}

export function merge(obj, ...sources) {
  each(sources, source => {
    each(source, (value, key) => {
      obj[key] = value;
    });
  });

  return obj;
}

export function removeSpaces(str) {
  return str.replace(/\s*/g, "") || "";
}

export function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  /* eslint-enable no-console */

  /* eslint-disable no-empty */
  try {
    throw new Error(message);
  } catch (e) {}
  /* eslint-enable no-empty */
}
