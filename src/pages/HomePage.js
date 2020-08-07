import React, {Component} from "react";
// import store from "../store/";
import {observer, inject} from "mobx-react";

// 做个加减法 done

// 做个todo list done
@inject("home")
@observer
class HomePage extends Component {
  render() {
    // const {home} = store;
    const {home} = this.props;
    return (
      <div>
        <h3>HomePage</h3>
        <p>{home.count}</p>
        <button onClick={() => home.add()}>add</button>
        <button onClick={() => home.minus()}>minus</button>
        <ul>
          {home.todos.map(item => (
            <Todo key={item.id} todo={item} />
          ))}
        </ul>
        <p>未完成：{home.unfinishedLength}个</p>
      </div>
    );
  }
}
export default HomePage;

const Todo = observer(({todo}) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.finised}
        onChange={() => (todo.finised = !todo.finised)}
      />
      {todo.title}
    </li>
  );
});
