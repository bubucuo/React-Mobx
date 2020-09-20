import React, {useRef, useReducer} from "react";
import {Reaction} from "mobx";
import {useForceUpdate} from "./utils";

function observerComponentNameFor(baseComponentName) {
  return `observer${baseComponentName}`;
}

export function useObserver(fn, baseComponentName = "observed", options = {}) {
  // const [, forceUpdate] = useReducer(x => x + 1, 0);

  const wantedForceUpdateHook = options.useForceUpdate || useForceUpdate;
  const forceUpdate = wantedForceUpdateHook();
  // 组件可以初次渲染，还可以更新
  const reactionTrackingRef = useRef(null);
  // todo 赋值reactionTrackingRef
  if (!reactionTrackingRef.current) {
    reactionTrackingRef.current = {
      reaction: new Reaction(
        observerComponentNameFor(baseComponentName),
        () => {
          // 响应式函数
          forceUpdate();
        }
      )
    };
  }

  const {reaction} = reactionTrackingRef.current;

  let rendering;
  reaction.track(() => {
    rendering = fn();
  });
  return rendering;
}
