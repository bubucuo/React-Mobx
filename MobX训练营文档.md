# MobX训练营文档

[TOC]

## 资源

1. [mobx中文文档](https://cn.mobx.js.org/)

2. [mobx源码地址](https://github.com/mobxjs/mobx)

3. [mobx-react英文文档（暂时没有找到完整版的中文版文档）](https://mobx-react.js.org/)

4. [mobx-react源码地址](https://github.com/mobxjs/mobx-react)

5. [mobx-react-lite源码地址](https://github.com/mobxjs/mobx-react-lite)

     

## 关于库

**mobx**：提供observable、action、computed等API的库，类比redux。

**mobx-react**：提供Provider、inject、observer、Observer、useObserver、useAsObservableSource、 useLocalStore等API的库。最新版的mobx-react中包括了mobx-react-lite。

**mobx-react-lite**：相当于是mobx-react的精简版，这个库只支持函数组件版，不支持Provider、inject，用户可以依靠React Context自己实现这两个API的功能。



## 正文

### MobX简介

简单、可扩展的状态管理。

安装 `yarn add mobx `

React 绑定库: `yarn add mobx-react`



### 环境准备

 	MobX 可以通过 *decorate* 工具在不支持装饰器语法的情况加使用。 尽管如此，多数 MobX 用户更喜欢装饰器语法，因为它更简洁。

装饰器参考https://cn.mobx.js.org/best/decorators.html



### 入门

MobX通过透明的函数响应式编程(transparently applying functional reactive programming - TFRP)使得状态管理变得简单和可扩展。MobX背后的哲学很简单:

*任何源自应用状态的东西都应该自动地获得。*

其中包括UI、数据序列化、服务器通讯，等等。

![MobX unidirectional flow](https://cn.mobx.js.org/flow.png)

React 和 MobX 是一对强力组合。React 通过提供机制把应用状态转换为可渲染组件树并对其进行渲染。而MobX提供机制来存储和更新应用状态供 React 使用。

对于应用开发中的常见问题，React 和 MobX 都提供了最优和独特的解决方案。React 提供了优化UI渲染的机制， 这种机制就是通过使用虚拟DOM来减少昂贵的DOM变化的数量。MobX 提供了优化应用状态与 React 组件同步的机制，这种机制就是使用响应式虚拟依赖状态图表，它只有在真正需要的时候才更新并且永远保持是最新的。



### API

#### Observable state(可观察的状态)

MobX 为现有的数据结构(如对象，数组和类实例)添加了可观察的功能。 通过使用 [@observable](http://cn.mobx.js.org/refguide/observable-decorator.html) 装饰器(ES.Next)来给你的类属性添加注解就可以简单地完成这一切。

```jsx
import {observable, computed} from "mobx";

class TodoList {
  @observable todos = [
    {id: "0", title: "任务0", finished: false},
    {id: "1", title: "任务1", finished: false}
  ];
  @computed get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length;
  }
}
```



#### Computed values(计算值)

定义在相关数据发生变化时自动更新的值。如上段代码，当添加了一个新的todo或者某个todo的 `finished` 属性发生变化时，MobX 会确保 `unfinishedTodoCount` 自动更新。

#### Reactions(反应)

Reactions 和计算值很像，但它不是产生一个新的值，而是会产生一些副作用，比如打印到控制台、网络请求、递增地更新 React 组件树以修补DOM、等等。

##### React 组件

如果你用 React 的话，可以把你的(无状态函数)组件变成响应式组件，方法是在组件上添加 [`observer`](http://cn.mobx.js.org/refguide/observable-decorator.html) 函数/ 装饰器. `observer`由 `mobx-react` 包提供的。

```jsx
import {observer} from "mobx-react";

@observer
class TodoListView extends React.Component {
  render() {
    const {todos, unfinishedTodoCount} = this.props.todoList;
    return (
      <div>
        <ul>
          {todos.map(todo => (
            <TodoView todo={todo} key={todo.id} />
          ))}
        </ul>
        Tasks left: {unfinishedTodoCount}
      </div>
    );
  }
}

const TodoView = observer(({todo}) =>
    <li>
        <input
            type="checkbox"
            checked={todo.finished}
            onClick={() => todo.finished = !todo.finished}
        />{todo.title}
    </li>
)
const store = new TodoList();

ReactDOM.render(
  <TodoListView todoList={store} />,
  document.getElementById("root")
);
```



##### 自定义 reactions

使用[`autorun`](http://cn.mobx.js.org/refguide/autorun.html)、[`reaction`](http://cn.mobx.js.org/refguide/reaction.html) 和 [`when`](http://cn.mobx.js.org/refguide/when.html) 函数即可简单的创建自定义 reactions，以满足你的具体场景。

例如，每当 `unfinishedTodoCount` 的数量发生变化时，下面的 `autorun` 会打印日志消息:

```javascript
autorun(() => {
    console.log("Tasks left: " + todos.unfinishedTodoCount)
})
```



##### MobX 会对什么作出响应?

*MobX 会对在执行跟踪函数期间读取的任何现有的可观察属性做出反应*。



#### Actions(动作)



### MobX要点

#### 1. 定义状态并使其可观察

可以用任何你喜欢的数据结构来存储状态，如对象、数组、类。 循环数据结构、引用，都没有关系。 只要确保所有会随时间流逝而改变的属性打上 `mobx` 的标记使它们变得可观察即可。

```javascript
import {observable} from 'mobx';

var appState = observable({
    timer: 0
});
Copy
```



#### 2. 创建视图以响应状态的变化

我们的 `appState` 还没有观察到任何的东西。 你可以创建视图，当 `appState` 中相关数据发生改变时视图会自动更新。 MobX 会以一种最小限度的方式来更新视图。

```javascript
import {observer} from 'mobx-react';

@observer
class TimerView extends React.Component {
    render() {
        return (
            <button onClick={this.onReset}>
                Seconds passed: {this.props.appState.timer}
            </button>
        );
    }

    onReset() {
        this.props.appState.resetTimer();
    }
};
```



#### 3. 更改状态

第三件要做的事就是更改状态。 也就是你的应用究竟要做什么。 不像一些其它框架，MobX 不会命令你如何如何去做。 这是最佳实践，但关键要记住一点: **MobX 帮助你以一种简单直观的方式来完成工作**。

下面的代码每秒都会修改你的数据，而当需要的时候UI会自动更新。 无论是在**改变**状态的控制器函数中，还是在应该**更新**的视图中，都没有明确的关系定义。 使用 `observable` 来装饰你的**状态**和**视图**，这足以让 MobX检测所有关系了。

```javascript
appState.resetTimer = action(function reset() {
    appState.timer = 0;
});

setInterval(action(function tick() {
    appState.timer += 1;
}), 1000);
```

只有在严格模式(默认是不启用)下使用 MobX 时才需要 `action` 包装。 建议使用 action，因为它将帮助你更好地组织应用，并表达出一个函数修改状态的意图。 同时,它还自动应用事务以获得最佳性能。



### 例子

入门：

```jsx
import React from "react";
import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, computed} from "mobx";
import "./index.css";

class StoreState {
  @observable todos = [
    {
      id: "0",
      checked: false,
      title: "列表1"
    },
    {
      id: "1",
      checked: true,
      title: "列表2"
    }
  ];
  @computed get checkedLength() {
    return this.todos.filter(todo => todo.checked).length;
  }
}

const store = new StoreState();

@observer
class TodoListView extends React.Component {
  render() {
    const {store} = this.props;
    return (
      <div>
        <h3>todo列表：</h3>
        <ul>
          {store.todos.map(todo => (
            <Todo key={todo.id} todo={todo} />
          ))}
        </ul>
        <p>被选中：{store.checkedLength}个！</p>
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

ReactDOM.render(
  <TodoListView store={store} />,
  document.getElementById("root")
);
```







### API 

#### MobX

##### observable

##### action

#####  computed

#### mobx-react 

##### Provider

##### inject

##### observer





#### mobx-react

##### how to observe-给组件添加响应式

有以下三种办法：

😎 [observer HOC](https://mobx-react.js.org/observer-hoc)

🤓 [observer component](https://mobx-react.js.org/observer-component)

🧐 [useObserver hook](https://mobx-react.js.org/observer-hook)

```jsx
import { observable } from 'mobx'
import { Observer, useObserver, observer } from 'mobx-react' // 6.x or mobx-react-lite@1.4.0
import ReactDOM from 'react-dom'

const person = observable({
  name: 'John',
})

// named function is optional (for debugging purposes)
const P1 = observer(function P1({ person }) {
  return <h1>{person.name}</h1>
})

const P2 = ({ person }) => <Observer>{() => <h1>{person.name}</h1>}</Observer>

const P3 = ({ person }) => {
  return useObserver(() => <h1>{person.name}</h1>)
}

ReactDOM.render(
  <div>
    <P1 person={person} />
    <P2 person={person} />
    <P3 person={person} />
  </div>,
)

setTimeout(() => {
  person.name = 'Jane'
}, 1000)
```



##### observer HOC

以下是参数，如果组件是函数式组件，可以使用options，类组件则没有。

```ts
observer<P>(baseComponent: React.FC<P>, options?: IObserverOptions): React.FC<P>

interface IObserverOptions {
    // Pass true to use React.forwardRef over the inner component. It's false by the default.
    forwardRef?: boolean
}
```

observer把组件转换成响应式组件，它可以自动追踪哪个可观察量被使用了以及当值改变的时候自动重新渲染这个组件。



```jsx
import { observer, useLocalStore } from 'mobx-react' // 6.x or mobx-react-lite@1.4.0

export const Counter = observer<Props>(props => {
  const store = useLocalStore(() => ({
    count: props.initialCount,
    inc() {
      store.count += 1
    },
  }))

  return (
    <div>
      <span>{store.count}</span>
      <button onClick={store.inc}>Increment</button>
    </div>
  )
})
```



##### Observer component

```ts
<Observer>{renderFn}</Observer>
```

例子：

```jsx
import { Observer, useLocalStore } from 'mobx-react'

export function ObservePerson() {
  const person = useLocalStore(() => ({ name: 'John' }))
  return (
    <div>
      {person.name} <i>I will never change my name</i>
      <div>
        <Observer>{() => <div>{person.name}</div>}</Observer>
        <button onClick={() => (person.name = 'Mike')}>
          I want to be Mike
        </button>
      </div>
    </div>
  )
}
```



##### useObserver hook

```ts
useObserver<T>(fn: () => T, baseComponentName = "observed", options?: IUseObserverOptions): T

interface IUseObserverOptions {
    // 可选的自定义hook，可以使得组件可以根据依赖项进行重渲染
    useForceUpdate: () => () => void
}
```



```jsx
import { useObserver, useLocalStore } from 'mobx-react' // 6.x or mobx-react-lite@1.4.0

function Person() {
  const person = useLocalStore(() => ({ name: 'John' }))
  return useObserver(() => (
    <div>
      {person.name}
      <button onClick={() => (person.name = 'Mike')}>No! I am Mike</button>
    </div>
  ))
}
```



##### React Context

```jsx
// src/stores/counter-store.tsx
import { observable, action, computed } from 'mobx'

export class CounterStore {
  @observable
  count = 0

  @action
  increment() {
    this.count++
  }

  @action
  decrement() {
    this.count--
  }

  @computed
  get doubleCount() {
    return this.count * 2
  }
}
```



````jsx
// src/stores/theme-store.tsx
import { observable, action } from 'mobx'

export class ThemeStore {
  @observable
  theme = 'light'

  @action
  setTheme(newTheme: string) {
    this.theme = newTheme
  }
}
````



```jsx
// src/contexts/index.tsx
import React from 'react'
import { CounterStore, ThemeStore } from '../stores'

export const storesContext = React.createContext({
  counterStore: new CounterStore(),
  themeStore: new ThemeStore(),
})
```





````jsx
// src/hooks/use-stores.tsx
import React from 'react'
import { storesContext } from '../contexts'

export const useStores = () => React.useContext(storesContext)
````



```jsx
import React from 'react'
import { observer } from 'mobx-react'
import { useStores } from '../hooks/use-stores'

// src/components/Counter.tsx
export const Counter = observer(() => {
  const { counterStore } = useStores()

  return (
    <>
      <div>{counterStore.count}</div>
      <button onClick={() => counterStore.increment()}>++</button>
      <button onClick={() => counterStore.decrement()}>--</button>
    </>
  )
})

// src/components/ThemeToggler.tsx
export const ThemeToggler = observer(() => {
  const { themeStore } = useStores()

  return (
    <>
      <div>{themeStore.theme}</div>
      <button onClick={() => themeStore.setTheme('light')}>
        set theme: light
      </button>
      <button onClick={() => themeStore.setTheme('dark')}>
        set theme: dark
      </button>
    </>
  )
})

// src/App.tsx
const App = () => (
  <main>
    <Counter />
    <ThemeToggler />
  </main>
)
```



### mobx-react opt-in variant of batched updates

https://github.com/mobxjs/mobx-react/pull/787



简单来说，我觉得你可以在mobx-react禁止掉它，然后去跑单元测试，你就会发现有些单元测试会通不过，比如https://github.com/mobxjs/mobx-react/blob/master/test/observer.test.js#L639。

以下是我观点：

1. 渲染两个基于observer的组件<Parent><Child /></Parent>。（另外，你也可以用普通的react state）。

2. 确保parent和child依赖于同一个可观察量（observable）（在单元测试里是store.user）。

3. 确保child有依赖于parent的地方。（在单元测试里，如果store.user不改变，则parent不会重新渲染child）。

4. 更改这个共享的可观察量。如设置store.user为undefined，则两个组件都要因为这个改变发生更新。然而，Parent必须在Child前面更新，因为Parent接下来要移除Child并且确保它不会再发生更新。而如果是Child先渲染，那么它会获store.user的name属性，这肯定会抛出异常；如果user没有发生改变，Child就不该渲染，而如果Parent先发生渲染的话则不会引发这样的异常了。

5. 一般来说，React会确保父组件总是在子组件前面渲染，它这么实现的原理就是把事件处理批量化（与MobX中的action非常相似）。因此在事件处理的末尾，所有组件的更新都被React按照正确的顺序调度之后再渲染，这也保证了在大多数情况下，父组件总是先与子组件渲染。

6. 然而，如果有这样一个更新，它不是源于React事件处理，那么这个批量处理就永远不可能发生。例如：如果NIIT在事件处理里放了一个timeout或者是在fetch回调里放了一个更新、websocket信息等等，它们会在React里执行，但是如果要确保批量处理顺序不会被破坏，我们就需要手动使用`unstable_batchedUpdates`来做批量更新。幸运的是，由于mobx已经有了一个批量处理机制，我们就可以直接合并它们俩了，这也就是这整个的工作机制，把react的更新应用到我们自己的事件循环当中。注意这也是React单元测试中需要用`act`的原因。

7. 因此，这种情况不会发生在所有的项目当中。这种场景只发生下父子组件+非React事件处理的结合的前提下

   

