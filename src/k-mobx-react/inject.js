import React, {useContext} from "react";
import {MobXProviderContext} from "./MobXProviderContext";

export const inject = (...storeNames) => component => {
  const Injector = React.forwardRef((props, ref) => {
    const context = useContext(MobXProviderContext);
    const newProps = {
      ...props,
      ...context
    };
    if (ref) {
      newProps.ref = ref;
    }
    return React.createElement(component, newProps);
  });

  return Injector;
};
