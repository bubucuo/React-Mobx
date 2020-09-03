import {useObserver} from "./useObserver";

function ObserverComponent({children, render}) {
  const component = children || render;

  // if (typeof component !== "function") {
  //   return null;
  // }
  return useObserver(component);
}

export {ObserverComponent as Observer};
