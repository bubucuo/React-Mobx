import React from "react";
import {observable, transaction, runInAction} from "mobx";
import {useAsObservableSource} from "./useAsObservableSource";

export function useLocalStore(initializer, current) {
  const source = useAsObservableSource(current);
  return React.useState(() => {
    const local = observable(initializer(source));

    runInAction(() => {
      Object.keys(local).forEach(key => {
        const value = local[key];
        if (typeof value === "function") {
          local[key] = wrapInTransaction(value, local);
        }
      });
    });

    return local;
  })[0];
}

// transaction保证更新时批量且同步运行的
function wrapInTransaction(fn, context) {
  return (...args) => transaction(() => fn.apply(context, args));
}
