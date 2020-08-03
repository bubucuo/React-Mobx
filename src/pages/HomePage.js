import React, {Component} from "react";
import {observer, inject} from "mobx-react";

@inject("home")
@observer
class HomePage extends Component {
  render() {
    const {home} = this.props;

    return (
      <div>
        <h3>HomePage</h3>
        <p>{home.num}</p>
        <button onClick={() => home.add()}>add</button>
        <button onClick={() => home.minus()}>minus</button>
        <h3>todo列表：</h3>
        <ul>
          {home.todos.map(todo => (
            <Todo key={todo.id} todo={todo} />
          ))}
        </ul>
        <p>被选中：{home.checkedLength}个！</p>
      </div>
    );
  }
}

function Todo({todo}) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.checked}
        onChange={() => (todo.checked = !todo.checked)}
      />
      {todo.title}
    </li>
  );
}

export default HomePage;
