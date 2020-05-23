import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {Provider} from "mobx-react";
import store from "./store";
// import {observer} from "mobx-react";
// import {observable, computed, action, autorun} from "mobx";

// class todoStore {
//   @observable todos = [
//     {id: "0", title: "任务0", finished: false},
//     {id: "1", title: "任务1", finished: false}
//   ];
//   @computed get unfinishedTodoCount() {
//     return this.todos.filter(todo => !todo.finished).length;
//   }

//   /* 推导值 */
//   get completedCount() {
//     return this.todos.filter(todo => todo.completed).length;
//   }
// }

// @observer
// class TodoListView extends React.Component {
//   render() {
//     const {todos, unfinishedTodoCount} = this.props.todoList;
//     return (
//       <div>
//         <ul>
//           {todos.map(todo => (
//             <TodoView todo={todo} key={todo.id} />
//           ))}
//         </ul>
//         Tasks left: {unfinishedTodoCount}
//       </div>
//     );
//   }
// }

// const TodoView = ({todo}) => (
//   <li>
//     <input
//       type="checkbox"
//       checked={todo.finished}
//       onChange={() => (todo.finished = !todo.finished)}
//     />
//     {todo.title}
//   </li>
// );
// const store = new todoStore();

// autorun(function() {
//   console.log("Completed %d of %d items", store.todos.length);
// });

// ReactDOM.render(
//   <TodoListView todoList={store} />,
//   document.getElementById("root")
// );

ReactDOM.render(
  <Provider {...store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
