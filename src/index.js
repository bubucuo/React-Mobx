import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
// import {Provider} from "mobx-react";
import {Provider} from "./k-mobx-react/";
import store from "./store/";

ReactDOM.render(
  <Provider {...store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
