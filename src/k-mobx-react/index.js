import React from "react";
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

export function inject(...storesName) {
  return function(component) {
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
}
// export const inject = (...storesName) => component => {
//   let Injector = React.forwardRef((props, ref) => {
//     let newProps = {...props};
//     const context = React.useContext(MobXProviderContext);
//     Object.assign(newProps, context);
//     if (ref) {
//       newProps.ref = ref;
//     }
//     return React.createElement(component, newProps);
//   });

//   return Injector;
// };

export function observer(component) {
  return makeClassComponentObserver(component);
}
