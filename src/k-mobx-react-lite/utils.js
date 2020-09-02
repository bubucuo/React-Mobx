import {useCallback, useEffect, useState} from "react";
const EMPTY_ARRAY = [];
export function useUnmount(fn) {
  useEffect(() => fn, EMPTY_ARRAY);
}
export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return update;
}
export function isPlainObject(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return !proto || proto === Object.prototype;
}
export function getSymbol(name) {
  if (typeof Symbol === "function") {
    return Symbol.for(name);
  }
  return `__$mobx-react ${name}__`;
}

const window = undefined;
const self = undefined;
const mockGlobal = {};

export function getGlobal() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  return mockGlobal;
}
