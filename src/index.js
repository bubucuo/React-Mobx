import React from "react";
import ReactDOM from "react-dom";
import {Provider, observer} from "mobx-react";
import {observable, computed} from "mobx";
import App from "./App";
import store from "./store";
import "./index.css";

// class StoreState {
//   @observable todos = [
//     {
//       id: "0",
//       checked: false,
//       title: "列表1"
//     },
//     {
//       id: "1",
//       checked: true,
//       title: "列表2"
//     }
//   ];
//   @computed get checkedLength() {
//     return this.todos.filter(todo => todo.checked).length;
//   }
// }

// const store = new StoreState();

// @observer
// class TodoListView extends React.Component {
//   render() {
//     const {store} = this.props;
//     return (
//       <div>
//         <h3>todo列表：</h3>
//         <ul>
//           {store.todos.map(todo => (
//             <Todo key={todo.id} todo={todo} />
//           ))}
//         </ul>
//         <p>被选中：{store.checkedLength}个！</p>
//       </div>
//     );
//   }
// }

// function Todo({todo}) {
//   return (
//     <li>
//       <input
//         type="checkbox"
//         checked={todo.checked}
//         onChange={() => (todo.checked = !todo.checked)}
//       />
//       {todo.title}
//     </li>
//   );
// }

// ReactDOM.render(
//   <TodoListView store={store} />,
//   document.getElementById("root")
// );

ReactDOM.render(
  <Provider {...store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
