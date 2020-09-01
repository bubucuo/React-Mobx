import {
  createAtom,
  _allowStateChanges,
  Reaction,
  $mobx,
  _allowStateReadsStart,
  _allowStateReadsEnd
} from "mobx";

import {isUsingStaticRendering} from "mobx-react-lite";
import {newSymbol, setHiddenProp, shallowEqual} from "./utils";
import {Component} from "react";

const mobxAdminProperty = $mobx || "$mobx";
const mobxIsUnmounted = newSymbol("isUnmounted");
const skipRenderKey = newSymbol("skipRender");
const isForcingUpdateKey = newSymbol("isForcingUpdate");

export default function makeClassComponentObserver(componentClass) {
  const target = componentClass.prototype;

  makeObservableProp(target, "props");
  makeObservableProp(target, "state");
  const baseRender = target.render;
  target.render = function() {
    return makeComponentReactive.call(this, baseRender);
  };

  return componentClass;
}

function makeComponentReactive(render) {
  if (isUsingStaticRendering() === true) {
    return render.call(this);
  }

  setHiddenProp(this, skipRenderKey, false);
  setHiddenProp(this, isForcingUpdateKey, false);

  const baseRender = render.bind(this);
  let isRenderingPending = false;
  const temName = Math.random() + ".render()";
  const reaction = new Reaction(temName, () => {
    if (!isRenderingPending) {
      isRenderingPending = true;
      if (this[mobxIsUnmounted] !== true) {
        let hasError = true;
        try {
          setHiddenProp(this, isForcingUpdateKey, true);
          if (!this[skipRenderKey]) {
            Component.prototype.forceUpdate.call(this);
            hasError = false;
          }
        } finally {
          setHiddenProp(this, isForcingUpdateKey, false);
          if (hasError) reaction.dispose();
        }
      }
    }
  });
  reaction["reactionComponent"] = this;
  reactiveRender[mobxAdminProperty] = reaction;
  this.render = reactiveRender;

  function reactiveRender() {
    isRenderingPending = false;
    let exception = undefined;
    let rendering = undefined;
    reaction.track(() => {
      try {
        rendering = _allowStateChanges(false, baseRender);
      } catch (e) {
        exception = e;
      }
    });
    if (exception) {
      throw exception;
    }
    return rendering;
  }

  return reactiveRender.call(this);
}

function makeObservableProp(target, propName) {
  const valueHolderKey = newSymbol(`reactProp_${propName}_valueHolder`);
  const atomHolderKey = newSymbol(`reactProps_${propName}_valueHolder`);

  function getAtom() {
    if (!this[atomHolderKey]) {
      setHiddenProp(this, atomHolderKey, createAtom("reactive " + propName));
    }
    return this[atomHolderKey];
  }
  Object.defineProperty(target, propName, {
    configurable: true,
    enumerable: true,
    get: function() {
      let prevReadState = false;

      if (_allowStateReadsStart && _allowStateReadsEnd) {
        prevReadState = _allowStateReadsStart(true);
      }
      getAtom.call(this).reportObserved();
      if (_allowStateReadsStart && _allowStateReadsEnd) {
        _allowStateReadsEnd(prevReadState);
      }
      return this[valueHolderKey];
    },
    set: function(v) {
      if (!this[isForcingUpdateKey] && !shallowEqual(this[valueHolderKey], v)) {
        setHiddenProp(this, valueHolderKey, v);
        setHiddenProp(this, skipRenderKey, v);
        getAtom.call(this).reportChanged();
        setHiddenProp(this, skipRenderKey, false);
      } else {
        setHiddenProp(this, valueHolderKey, v);
      }
    }
  });
}
