import React, {Component, Children} from "react";
import {observer, Observer, useObserver} from "mobx-react";

@observer
class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      count: 0
    };
  }
  render() {
    const {input, count} = this.state;
    return (
      <div>
        <h3>TodoList</h3>

        <input
          type="text"
          value={input}
          onChange={e => this.setState({input: e.target.value})}
        />

        <button onClick={() => this.setState({count: count + 1})}>
          add click {count}
        </button>

        {this.props.todoStore.todos.map(todo => (
          <Todo
            key={todo.id}
            todo={todo}
            change={this.props.todoStore.change}
            count={{count}}
          />
        ))}
        <p>未完成任务： {this.props.todoStore.unfinishedCount}个</p>
        <Child count={{count}} />
      </div>
    );
  }
}

export default TodoList;

const Child = React.memo(
  props => {
    console.log("child props"); //sy-log
    return <div>Child</div>;
  },
  (prevProps, nextProps) => prevProps.count.count === nextProps.count.count
);

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
  return useObserver(() => (
    <div>
      <input
        type="checkbox"
        checked={todo.finished}
        //onChange={() => (todo.finished = !todo.finished)}
        onChange={() => change(todo)}
      />
      {todo.title}
    </div>
  ));
};
