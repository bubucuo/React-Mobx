import React from "react";
import {Observer, observer as observerLite} from "../k-mobx-react-lite/index";

export function observer(component) {
  // forwardRef
  if (component["$$typeof"] === Symbol.for("react.forward_ref")) {
    const baseRender = component["render"];
    return React.forwardRef(function() {
      const args = arguments;
      return <Observer>{() => baseRender.apply(undefined, args)}</Observer>;
    });
  }
  // 类组件
  if (component.prototype && component.prototype.isReactComponent) {
  }
  // 函数组件
  return observerLite(component);
}
