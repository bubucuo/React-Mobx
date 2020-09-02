import React from "react";
import {observer as observerLite, Observer} from "mobx-react-lite";
import makeClassComponentObserver from "./makeClassComponentObserver";

export const MobXProviderContext = React.createContext();

export function Provider({children, ...stores}) {
  const parentValue = React.useContext(MobXProviderContext);
  const mutableProviderRef = React.useRef({...parentValue, ...stores});
  const value = mutableProviderRef.current;
  return (
    <MobXProviderContext.Provider value={value}>
      {children}
    </MobXProviderContext.Provider>
  );
}

// hoc
// 把store注入组件
export const inject = (...storesName) => component => {
  let Injector = React.forwardRef((props, ref) => {
    let newProps = {...props};
    const context = React.useContext(MobXProviderContext);
    Object.assign(newProps, context);
    if (ref) {
      newProps.ref = ref;
    }
    return React.createElement(component, newProps);
  });

  return Injector;
};

export function observer(component) {
  // 函数组件
  if (
    typeof component === "function" &&
    (!component.prototype || !component.prototype.render)
  ) {
    return observerLite(component);
  }

  return makeClassComponentObserver(component);
}
