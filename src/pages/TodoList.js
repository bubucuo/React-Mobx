import React, {Component} from "react";
import {observer} from "mobx-react";
import {Observer, useObserver} from "mobx-react-lite";

@observer
class TodoList extends Component {
  render() {
    return (
      <div>
        <h3>TodoList</h3>
        <ul>
          {this.props.todoStore.todos.map(todo => (
            <Todo
              key={todo.id}
              todo={todo}
              change={this.props.todoStore.change}
            />
          ))}
        </ul>
        <p>剩余任务事件：{this.props.todoStore.unfinishedCount}</p>
      </div>
    );
  }
}
export default TodoList;

// 给组件添加响应式

// 方法1： hoc observer（高阶组件： 是个函数，这个函数接收组件作为参数，并且返回一个新组件）
// const Todo = observer(({todo, change}) => {
//   return (
//     <li>
//       <input
//         type="checkbox"
//         checked={todo.finished}
//         //onChange={() => (todo.finished = !todo.finished)}
//         onChange={() => change(todo)}
//       />
//       {todo.title}
//     </li>
//   );
// });

// 方法2：Observer component
// const Todo = ({todo, change}) => {
//   return (
//     <Observer>
//       {() => (
//         <li>
//           <input
//             type="checkbox"
//             checked={todo.finished}
//             //onChange={() => (todo.finished = !todo.finished)}
//             onChange={() => change(todo)}
//           />
//           {todo.title}
//         </li>
//       )}
//     </Observer>
//   );
// };

// 方法3：useObserver hook方法
const Todo = ({todo, change}) => {
  return useObserver(() => (
    <li>
      <input
        type="checkbox"
        checked={todo.finished}
        //onChange={() => (todo.finished = !todo.finished)}
        onChange={() => change(todo)}
      />
      {todo.title}
    </li>
  ));
};
