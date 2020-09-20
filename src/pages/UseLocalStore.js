import React from "react";
// import {useLocalStore, useObserver} from "mobx-react-lite";
import {useLocalStore, useObserver} from "../k-mobx-react-lite/";

function UseLocalStore(props) {
  const omg = {...props};
  const countStore = useLocalStore(
    () => ({
      count: omg.init === undefined ? 0 : omg.init,
      add() {
        this.count = this.count + 1;
      },
      get emoji() {
        return this.count % 2 ? "😜" : "🏃";
      }
    }),
    omg
  );
  return useObserver(() => (
    <div className="border">
      <h3>UseLocalStore</h3>
      <button onClick={countStore.add}>count: {countStore.count}</button>
      <p>{countStore.emoji}</p>
    </div>
  ));
}
export default UseLocalStore;
