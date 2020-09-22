import React from "react";
import {observable, transaction, runInAction} from "mobx";
import {useAsObservableSource} from "./useAsObservableSource";

export function useLocalStore(initializer, current = {}) {
  // 如果有current，要把current转为为observable，并且还要注意存储，保证复用
  const source = useAsObservableSource(current);
  // 返回的结果initializer执行的结果，并且还要保证initializer只执行一次

  return React.useState(() => {
    const local = observable(initializer(source));

    runInAction(() => {
      // todo
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

function wrapInTransaction(fn, context) {
  return (...args) => transaction(() => fn.apply(context, args));
}
