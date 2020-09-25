import React, {useRef, useContext} from "react";
import {MobXProviderContext} from "./MobXProviderContext";

export function Provider({children, ...stores}) {
  const parentValue = useContext(MobXProviderContext);
  const mutableProvdierRef = useRef({...parentValue, ...stores});
  const value = mutableProvdierRef.current;

  return (
    <MobXProviderContext.Provider value={value}>
      {children}
    </MobXProviderContext.Provider>
  );
}
