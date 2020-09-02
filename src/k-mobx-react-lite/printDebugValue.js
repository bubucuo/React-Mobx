import {getDependencyTree, Reaction} from "mobx";

export function printDebugValue(v) {
  return getDependencyTree(v);
}
