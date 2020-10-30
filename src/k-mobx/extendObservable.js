import {asObservableObject} from "./observableObject";

export default function extendObservable(target, props) {
  // todo 把target变成可观察, ->ObservableObject

  // step1
  const adm = asObservableObject(target);

  // step2 给目标对象添加属性
  Object.keys(props).forEach(key => {
    adm.addObservableProp_(key, props[key]);
  });

  return target;
}
