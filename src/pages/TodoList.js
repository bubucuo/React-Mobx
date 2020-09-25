import React, {Component, Children, useReducer} from "react";

// import {observer as observerLite, Observer, useObserver} from "mobx-react-lite";
// import {observer, inject, MobXProviderContext} from "mobx-react";

import {
  useObserver,
  Observer,
  observer as observerLite
} from "../k-mobx-react-lite/index";
import {observer, MobXProviderContext, inject} from "../k-mobx-react/index";

// // @inject("todoStore", "omg")
// // @observer
// class TodoList extends Component {
//   //static contextType = MobXProviderContext;
//   inputRef = React.createRef();
//   render() {
//     // const {todoStore, omg} = this.context;
//     return (
//       <MobXProviderContext.Consumer>
//         {({todoStore, omg}) => {
//           return (
//             <Observer>
//               {() => (
//                 <div>
//                   <h3>TodoList</h3>
//                   <input type="text" ref={this.inputRef} />
//                   {todoStore.todos.map(todo => (
//                     <Todo
//                       key={todo.id}
//                       todo={todo}
//                       change={todoStore.change}
//                       ref={this.inputRef}
//                     />
//                   ))}
//                   <p>未完成任务： {todoStore.unfinishedCount}个</p>
//                   <p>{omg}</p>
//                 </div>
//               )}
//             </Observer>
//           );
//         }}
//       </MobXProviderContext.Consumer>
//     );
//   }
// }

// 使用inject给函数组件注入数据
const TodoList = inject(
  "todoStore",
  "omg"
)(props => {
  return (
    <div>
      <h3>TodoList</h3>
      {props.todoStore.todos.map(todo => (
        <Todo key={todo.id} todo={todo} change={props.todoStore.change} />
      ))}
      <p>未完成任务： {props.todoStore.unfinishedCount}个</p>
      <p>{props.omg}</p>
    </div>
  );
});

// 使用useContext
// const TodoList = observer(props => {
//   const {todoStore, omg} = React.useContext(MobXProviderContext);
//   return (
//     <div>
//       <h3>TodoList</h3>
//       {todoStore.todos.map(todo => (
//         <Todo key={todo.id} todo={todo} change={todoStore.change} />
//       ))}
//       <p>未完成任务： {todoStore.unfinishedCount}个</p>
//       <p>{omg}</p>
//     </div>
//   );
// });

export default TodoList;

// 如何给组件添加响应式
// 方法1： observer hoc（高阶组件：接收组件为参数并且返回一个新组件的函数）
// const Todo = observer(
//   ({todo, change}, ref) => {
//     console.log("input value", ref.current && ref.current.value); //sy-log
//     return (
//       <div>
//         <input
//           type="checkbox"
//           checked={todo.finished}
//           onChange={() => change(todo)}
//         />
//         {todo.title}
//       </div>
//     );
//   },
//   {forwardRef: true}
// );

// 自己配置forwardRef
const Todo = observer(
  React.forwardRef((props, ref) => {
    const {todo, change} = props;
    // console.log("input value", ref.current && ref.current.value); //sy-log
    return (
      <div>
        <input
          type="checkbox"
          checked={todo.finished}
          onChange={() => change(todo)}
        />
        {todo.title}
      </div>
    );
  })
);

// // 方法2： Observer component
// const Todo = ({todo, change}) => {
//   return (
//     // <Observer>
//     //   {() => (
//     //     <div>
//     //       <input
//     //         type="checkbox"
//     //         checked={todo.finished}
//     //         onChange={() => change(todo)}
//     //       />
//     //       {todo.title}
//     //     </div>
//     //   )}
//     // </Observer>

//     <Observer
//       render={() => (
//         <div>
//           <input
//             type="checkbox"
//             checked={todo.finished}
//             onChange={() => change(todo)}
//           />
//           {todo.title}
//         </div>
//       )}></Observer>
//   );
// };

// 方法3： useObserver hook
// const Todo = ({todo, change}) => {
//   const [, forceUpdate] = useReducer(x => x + 1, 0);

//   return useObserver(
//     () => (
//       <div>
//         <input
//           type="checkbox"
//           checked={todo.finished}
//           onChange={() => change(todo)}
//         />
//         {todo.title}
//       </div>
//     ),
//     undefined,
//     {
//       //useForceUpdate: () => forceUpdate
//     }
//   );
// };
