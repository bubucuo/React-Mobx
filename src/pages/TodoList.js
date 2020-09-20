import React, {Component, Children, useReducer} from "react";
// import {observer, Observer, useObserver} from "mobx-react";

import {useObserver} from "../k-mobx-react-lite/index";

// @observer
class TodoList extends Component {
  render() {
    return (
      <div>
        <h3>TodoList</h3>

        {this.props.todoStore.todos.map(todo => (
          <Todo
            key={todo.id}
            todo={todo}
            change={this.props.todoStore.change}
          />
        ))}
        <p>未完成任务： {this.props.todoStore.unfinishedCount}个</p>
      </div>
    );
  }
}

export default TodoList;

// 如何给组件添加响应式
// // 方法1： observer hoc（高阶组件：接收组件为参数并且返回一个新组件的函数）
// const Todo = observer(({todo, change}) => {
//   console.log("todo props"); //sy-log
//   return (
//     <div>
//       <input
//         type="checkbox"
//         checked={todo.finished}
//         //onChange={() => (todo.finished = !todo.finished)}
//         onChange={() => change(todo)}
//       />
//       {todo.title}
//     </div>
//   );
// });

// 方法2： Observer component
// const Todo = ({todo, change}) => {
//   return (
//     <Observer>
//       {() => (
//         <div>
//           <input
//             type="checkbox"
//             checked={todo.finished}
//             //onChange={() => (todo.finished = !todo.finished)}
//             onChange={() => change(todo)}
//           />
//           {todo.title}
//         </div>
//       )}
//     </Observer>
//   );
// };

// 方法3： useObserver hook
const Todo = ({todo, change}) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  return useObserver(
    () => (
      <div>
        <input
          type="checkbox"
          checked={todo.finished}
          onChange={() => change(todo)}
        />
        {todo.title}
      </div>
    ),
    undefined
    // {useForceUpdate: () => forceUpdate}
  );
};
