import React from "react";
// import {
//   useLocalStore,
//   useObserver
//   // useAsObservableSource
// } from "mobx-react-lite";

import {
  Observer,
  useLocalStore,
  useObserver,
  useAsObservableSource
} from "../k-mobx-react-lite/";

function UseLocalStore(props) {
  const newProps = {...props}; //useAsObservableSource(props);
  // useLocalStore第一个参数是一个初始化函数，并且这个函数只会执行一次，并且在整个生命周期中都是有效的
  const countStore = useLocalStore(
    newProps => ({
      count: props.init === undefined ? 0 : props.init,
      add() {
        this.count = this.count + 1;
      },
      get emoji() {
        return this.count % 2 ? "😜" : "🏃";
      },
      get specialNum() {
        return newProps.init > -1 && newProps.init < 10
          ? "0" + newProps.init
          : newProps.init;
      }
    }),
    newProps
  );
  // return useObserver(() => (
  //   <div className="border">
  //     <h3>UseLocalStore</h3>
  //     <button onClick={countStore.add}>count: {countStore.count}</button>
  //     <p>{countStore.emoji}</p>
  //     <p>{countStore.specialNum}</p>
  //   </div>
  // ));
  // 实现更细微的控制
  return (
    <Observer>
      {() => (
        <div className="border">
          <h3>UseLocalStore</h3>
          <button onClick={countStore.add}>count: {countStore.count}</button>
          <p>{countStore.emoji}</p>
          <p>{countStore.specialNum}</p>
        </div>
      )}
    </Observer>
  );
}
export default UseLocalStore;