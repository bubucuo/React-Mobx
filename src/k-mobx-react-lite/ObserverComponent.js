import {useObserver} from "./useObserver";

function ObserverComponent({children, render}) {
  const component = children || render;
  return useObserver(component);
}

export {ObserverComponent as Observer};
