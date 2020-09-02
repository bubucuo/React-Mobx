import React from "react";
import {useForceUpdate} from "./utils";
import {isUsingStaticRendering} from "./staticRendering";
import {Reaction} from "mobx";
import {
  createTrackingData,
  scheduleCleanupOfReactionIfLeaked,
  recordReactionAsCommitted
} from "./reactionCleanupTracking";
import {printDebugValue} from "./printDebugValue";

export function useObserver(fn, baseComponentName = "observed") {
  // s-why 这里源码里是有的，但是加上的话 会不符合hook不能使用在条件语句里的的规则，因此怎么整？？？
  // if (isUsingStaticRendering()) {
  //   return fn();
  // }

  const wantedForceUpdateHook = useForceUpdate;
  const forceUpdate = wantedForceUpdateHook();

  const reactionTrackingRef = React.useRef(null);
  if (!reactionTrackingRef.current) {
    // 组件的首次渲染，或者是
    const newReaction = new Reaction(baseComponentName, () => {
      // 可观察量已经发生改变，意味着我们想要重新渲染
      // 但是如果这是一个还没有走到useEffect阶段的组件，我们可能需要
      if (trackingData.mounted) {
        forceUpdate();
      } else {
        newReaction.dispose();
        reactionTrackingRef = null;
      }
    });

    const trackingData = createTrackingData(newReaction);
    reactionTrackingRef.current = trackingData;
    scheduleCleanupOfReactionIfLeaked(reactionTrackingRef);
  }
  const {reaction} = reactionTrackingRef.current;
  React.useDebugValue(reaction, printDebugValue);
  React.useEffect(() => {
    // 只在首次渲染的时候调用
    recordReactionAsCommitted(reactionTrackingRef);

    if (reactionTrackingRef.current) {
      // 我们已经从render中获取到reaction
      // 我们需要做的就是记录下它现在被装载，这样下次的可观察量变化去触发再次渲染
      reactionTrackingRef.current.mounted = true;
    } else {
      // 重现创建reaction
      reactionTrackingRef.current = {
        reaction: new Reaction(
          observerComponentNameFor(baseComponentName),
          () => {
            forceUpdate();
          }
        ),
        cleanAt: Infinity
      };
      forceUpdate();
    }
    return () => {
      reactionTrackingRef.current.reaction.dispose();
      reactionTrackingRef.current = null;
    };
  }, []);

  // render初始组件，但是reaction追踪这可观察量，因此一旦依赖变化，渲染就无效了
  let rendering;
  let exception;
  reaction.track(() => {
    try {
      rendering = fn();
    } catch (e) {
      exception = e;
    }
  });
  if (exception) {
    throw exception;
  }
  return rendering;
}

function observerComponentNameFor(baseComponentName: string) {
  return `observer${baseComponentName}`;
}
