export const $mobx = Symbol("mobx administration");

const plainObjectString = Object.toString();
export const objectPrototype = Object.prototype;
export const defineProperty = Object.defineProperty;

export function isObject(value) {
  return value !== null && typeof value === "object";
}

export function isPlainObject(value) {
  if (!isObject(value)) return false;
  const proto = Object.getPrototypeOf(value);
  if (proto == null) return true;
  return proto.constructor.toString() === plainObjectString;
}

export function isFunction(fn) {
  return typeof fn === "function";
}

export function hasProp(target, prop) {
  return objectPrototype.hasOwnProperty.call(target, prop);
}

export function addHiddenProp(object, propName, value) {
  defineProperty(object, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value
  });
}
