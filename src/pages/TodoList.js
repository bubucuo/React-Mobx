import React, {Component} from "react";
import {observer} from "mobx-react";

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

const Todo = observer(({todo, change}) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.finished}
        //onChange={() => (todo.finished = !todo.finished)}
        onChange={() => change(todo)}
      />
      {todo.title}
    </li>
  );
});
