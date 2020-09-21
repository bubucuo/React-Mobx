import React from "react";
import {observable, runInAction} from "mobx";

export function useAsObservableSource(current) {
  const [res] = React.useState(() => observable(current));

  runInAction(() => {
    Object.assign(res, current);
  });

  return res;
}
