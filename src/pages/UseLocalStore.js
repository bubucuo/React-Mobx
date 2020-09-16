import React from "react";
import {useLocalStore, useObserver} from "mobx-react";

function UseLocalStore(props) {
  const countStore = useLocalStore(
    () => ({
      count: props.init === undefined ? 0 : props.init,
      add() {
        this.count = this.count + 1;
      },
      get emoji() {
        return this.count % 2 ? "😜" : "🏃";
      }
    }),
    props
  );
  return useObserver(() => (
    <div className="border">
      <h3>UseLocalStore</h3>
      <button onClick={countStore.add}>count: {countStore.count}</button>
    </div>
  ));
}
export default UseLocalStore;
