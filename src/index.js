import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
// import {Provider} from "mobx-react";
// import {Provider} from "./k-mobx-react/";

// import todoStore from "./store/todoStore";

ReactDOM.render(
  // <Provider todoStore={todoStore} omg={"omg-omg"}>
  <App />,
  // </Provider>,
  document.getElementById("root")
);
