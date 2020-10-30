import {isPlainObject} from "./utils";
import extendObservable from "./extendObservable";

function createObservable(v) {
  if (isPlainObject(v)) {
    return observable.object(v);
  }
}

const observableFactories = {
  object: props => {
    return extendObservable({}, props);
  }
};

export const observable = Object.assign(createObservable, observableFactories);
