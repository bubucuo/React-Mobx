// step1. 定义状态并使其可观察
// import {observable} from "mobx";
import {observable} from "../k-mobx/";

const appState = observable({
  timer: 100
});

// appState.resetTimer = action(function reset() {
//   appState.timer = 0;
// });

// setInterval(
//   action(function tick() {
//     appState.timer += 1;
//   }),
//   1000
// );

export default appState;
