import React, {Component} from "react";
// import store from "../store/";
// import {observer, inject, Observer, useObserver} from "mobx-react";
import {observer, inject} from "../k-mobx-react/";
import {Observer, useObserver} from "../k-mobx-react-lite/";

// 做个加减法 done

// 做个todo list done
@inject("home")
@observer
class HomePage extends Component {
  render() {
    // const {home} = store;
    const {home} = this.props;
    console.log("HomePage", home); //sy-log
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
        {/* <p>未完成：{home.unfinishedLength}个</p> */}

        {/* <Input value={home.inputValue} setValue={home.setInputValue} /> */}
      </div>
    );
  }
}
export default HomePage;

// 方法1：  observer HOC
// const Todo = observer(({todo}) => {
//   return (
//     <li>
//       <input
//         type="checkbox"
//         checked={todo.finised}
//         onChange={() => (todo.finised = !todo.finised)}
//       />
//       {todo.title}
//     </li>
//   );
// });

// 方法2： observer component
const Todo = ({todo}) => {
  return (
    <Observer>
      {() => (
        <li>
          <input
            type="checkbox"
            checked={todo.finised}
            onChange={() => (todo.finised = !todo.finised)}
          />
          {todo.title}
        </li>
      )}
    </Observer>
  );
};

// 方法3： useObserver hook
// const Todo = ({todo}) => {
//   return useObserver(() => (
//     <li>
//       <input
//         type="checkbox"
//         checked={todo.finised}
//         onChange={() => (todo.finised = !todo.finised)}
//       />
//       {todo.title}
//     </li>
//   ));
// };
