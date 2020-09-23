import React, {useState} from "react";
// import TimerView from "./pages/TimerView";
// import appState from "./store/appState";
import TodoList from "./pages/TodoList";
import todoStore from "./store/todoStore";
// import UseLocalStore from "./pages/UseLocalStore";

export default function App(props) {
  const [countInit, setCountInit] = useState(-1);
  return (
    <div>
      {/* <button onClick={() => setCountInit(countInit + 1)}>
        add countInit{countInit}
      </button> */}
      {/* <TimerView appState={appState} /> */}
      <TodoList todoStore={todoStore} />
      {/* <UseLocalStore init={countInit} /> */}
    </div>
  );
}
