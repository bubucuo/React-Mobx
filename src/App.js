import React from "react";
import TimerView from "./pages/TimerView";
import appState from "./store/appState";

export default function App(props) {
  return (
    <div>
      <TimerView appState={appState} />
    </div>
  );
}
