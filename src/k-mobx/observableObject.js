import {hasProp, $mobx, addHiddenProp} from "./utils";

export function asObservableObject(target) {
  if (hasProp(target, $mobx)) {
    return target[$mobx];
  }
  const adm = new ObservableObjectAdministration(target);

  addHiddenProp(target, $mobx, adm);

  return adm;
}

export class ObservableObjectAdministration {
  constructor(target_) {
    this.target_ = target_;
  }

  // 添加属性
  addObservableProp_(propName, newValue) {
    this.target_[propName] = newValue;
  }
}
