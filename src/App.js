import React from "react";
import TimerView from "./pages/TimerView";
import appState from "./store/appState";
import TodoList from "./pages/TodoList";
import todoStore from "./store/todoStore";

export default function App(props) {
  return (
    <div>
      {/* <TimerView appState={appState} /> */}
      <TodoList todoStore={todoStore} />
    </div>
  );
}
