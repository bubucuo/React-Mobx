# MobX训练营文档

[TOC]

## 资源

1. [mobx中文文档](https://cn.mobx.js.org/)

2. [mobx源码地址](https://github.com/mobxjs/mobx)

3. [mobx-react-lite英文文档（暂时没有找到完整版的中文版文档）](https://mobx-react.js.org/)

4. [mobx-react源码地址](https://github.com/mobxjs/mobx-react)(下面的README.md里是完整版本的英文文档)

5. [mobx-react-lite源码地址](https://github.com/mobxjs/mobx-react-lite)

   ​    

## 关于库

**mobx**：提供observable、action、computed等API的库，类比redux。

**mobx-react**：提供Provider、inject、observer、Observer、useObserver、useAsObservableSource、 useLocalStore等API的库。最新版的mobx-react中包括了mobx-react-lite。

**mobx-react-lite**：相当于是mobx-react的精简版，不支持Provider、inject，但是用户可以依靠React Context自己实现这两个API的功能。



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



### lesson1-MobX要点

#### 1. 定义状态并使其可观察

可以用任何你喜欢的数据结构来存储状态，如对象、数组、类。 循环数据结构、引用，都没有关系。 只要确保所有会随时间流逝而改变的属性打上 `mobx` 的标记使它们变得可观察即可。

```javascript
import {observable} from 'mobx';

var appState = observable({
    timer: 0
});
```



#### 2. 创建视图以响应状态的变化

我们的 `appState` 还没有观察到任何的东西。 你可以创建视图，当 `appState` 中相关数据发生改变时视图会自动更新。 MobX 会以一种最小限度的方式来更新视图。

```javascript
import React, {Component} from "react";
import {observer} from "mobx-react";

@observer
class TimerView extends React.Component {
  onReset = () => {
    this.props.appState.resetTimer();
  };
  render() {
    return (
      <button onClick={this.onReset}>
        Seconds passed: {this.props.appState.timer}
      </button>
    );
  }
}

export default TimerView;
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



### lesson2-MobX API 概念

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

任何应用都有动作。动作是任何用来修改状态的东西。

使用MobX你可以在代码中显式地标记出动作所在的位置。 动作可以有助于更好的组织代码。 建议在任何更改 observable 或者有副作用的函数上使用动作。 结合开发者工具的话，动作还能提供非常有用的调试信息。 注意: 当启用**严格模式**时，需要强制使用 `action`，参见 `enforceActions`。

```jsx
import {configure} from "mobx";

// 不允许在动作外部修改状态
configure({enforceActions: "observed"});
```



#### `enforceActions`

也被称为“严格模式”。

在严格模式下，不允许在 [`action`](https://cn.mobx.js.org/refguide/action.html) 外更改任何状态。 可接收的值:

- `"never"` (默认): 可以在任意地方修改状态
- `"observed"`: 在某处观察到的所有状态都需要通过动作进行更改。在正式应用中推荐此严格模式。
- `"always"`: 状态始终需要通过动作来更新(实际上还包括创建)。



### lesson3-给组件添加响应式

![image-20200908160328366](https://tva1.sinaimg.cn/large/007S8ZIlly1gijayj5424j30z80u07wh.jpg)



给组件添加响应式有以下三种办法：

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

注意：mobx-react与mobx-react-lite中都有observer，但是后者不支持类组件。

以下是参数，如果组件是函数式组件，可以使用options，类组件则没有。

```tsx
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

observer内部使用了React.memo，所以使用的时候我们可以不用自己再封装memo，但值得注意的是，observer内部封装的memo只负责默认的浅比较，因为mobx-react认为，observed组件很少需要基于复杂的props进行更新渲染。以下是mobx-react-lite中的源码部分截图，参考行61-63的注释。

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gircs01emmj30ut0u0e81.jpg" alt="image-20200915151056480" style="zoom:50%;" />



##### Observer component

```ts
<Observer>{renderFn}</Observer>
```

接收一个匿名无参数的函数作为children，并且返回React元素。

```jsx
import { Observer, useLocalStore } from 'mobx-react' // 6.x or mobx-react-lite@1.4.0

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

注意：只能使得它自己的返回组件是响应式的，如果你里面还嵌套了别的组件，那这个里面的组件得靠自己变成响应式~

看下面的例子：

```jsx
import { Observer } from 'mobx-react' // 6.x or mobx-react-lite@1.4.0

function ObservePerson() {
  return (
    <Observer>
      {() => (
        <GetStore>{store => <div className="self">{store.wontSeeChangesToThis}</div>}</GetStore>
      )}
    </Observer>
  )
}
```

在上面这个例子里，这个className为div就不是响应式，如果想变成响应式，需要再额外添加，比如说像下面这样：

```jsx
import { Observer } from 'mobx-react' // 6.x or mobx-react-lite@1.4.0

function ObservePerson() {
  return (
    <GetStore>
      {store => (
        <Observer>{() => <div>{store.changesAreSeenAgain}</div>}</Observer>
      )}
    </GetStore>
  )
}
```

##### useObserver hook

函数签名：

```tsx
useObserver<T>(fn: () => T, baseComponentName = "observed", options?: IUseObserverOptions): T

interface IUseObserverOptions {
    // optional custom hook that should make a component re-render (or not) upon changes
    useForceUpdate: () => () => void
}
```



这个自定义hook方法只存在于mobx-react-lite，或者是mobx-react@6。

这个hook方法也可以使组件变得响应式，但是关于一些优化兼容手段如memo或者forwardRef，则需要你自己手动添加。

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

这个方法有个优点，就是任何的hook改变observable，组件都不会重复渲染。

这个方法有个缺点，就是就算你是在组件的某一部分使用，但是却能引起组件的全部更新~，所以慎用，如果想要精细控制的话，还是要选择<Observer/>或者useForceUpdate。



### lesson4-Mange state-状态管理

```tsx
useLocalStore<T, S>(initializer: () => T, source?: S): T
```

本地的observable state可以使用useLocalStore，但是记住一点就是对于每个组件实例，useLocalStore的**初始化函数只执行一次**，并且是在组件的整个生命周期里都有效。

useLocalStore返回对象里的所有属性值都会自动转变为observable，所有getters会被转化为computed属性，所有方法也会与store关联且自动引用 mobx的transaction。

```jsx
import React from 'react'
import { useLocalStore, useObserver } from 'mobx-react' // 6.x

export const SmartTodo = () => {
  const todo = useLocalStore(() => ({
    title: 'Click to toggle',
    done: false,
    toggle() {
      todo.done = !todo.done
    },
    get emoji() {
      return todo.done ? '😜' : '🏃'
    },
  }))

  return useObserver(() => (
    <h3 onClick={todo.toggle}>
      {todo.title} {todo.emoji}
    </h3>
  ))
}
```



##### 不要解构

解构的话，会破坏响应式。mobx中的observables都是对象，一旦解构，所有的原始变量都会停留在上一个值，而不再是observable了。比如上面的例子中，你可以取值todo.title，但是不能const {title} = todo。



##### 关于全局store

虽然useLocalStore的命名听着像是只能用在组件内，但实际上，完全可以使用它再加上React Context来处理全局的store。



### lesson5-实现mobx-react-lite的useObserver

useObserver简版实现代码如下，详细参考git-lesson5：https://github.com/bubucuo/React-Mobx/tree/lesson5

##### Reaction

Reaction是一种的特殊的衍生（Derivation），可以注册响应函数，如强制组件更新的forceUpdate。常用于触发副作用，如打印日志、更新 DOM 或者发送网络请求等等。

```js
import React, {useRef, useReducer, useEffect} from "react";
import {Reaction} from "mobx";
import {useForceUpdate} from "./utils";

function observerComponentNameFor(baseComponentName) {
  return `observer${baseComponentName}`;
}

export function useObserver(fn, baseComponentName = "observed", options = {}) {
  // const [, forceUpdate] = useReducer(x => x + 1, 0);

  const wantedForceUpdateHook = options.useForceUpdate || useForceUpdate;
  const forceUpdate = wantedForceUpdateHook();
  // 组件有初次渲染和更新，那这个时候reaction得做一个缓存，
  const reactionTrackingRef = useRef(null);

  if (!reactionTrackingRef.current) {
    reactionTrackingRef.current = {
      reaction: new Reaction(
        observerComponentNameFor(baseComponentName),
        () => {
          // 响应函数使用forceUpdate
          forceUpdate();
        }
      )
    };
  }

  const {reaction} = reactionTrackingRef.current;

  useEffect(() => {
    return () => {
      // 清理reaction
      reactionTrackingRef.current.reaction.dispose();
      reactionTrackingRef.current = null;
    };
  }, []);

  let rendering;

  reaction.track(() => {
    rendering = fn();
  });

  return rendering;
}
```

####  

### lesson6-实现mobx-react-lite的Observer与observer

两者都是基于useObserver实现的。

首先是Observer Component，把children或者render作为useObserver的第一个参数作为函数返回即可。

```js
import {useObserver} from "./useObserver";

function ObserverComponent({children, render}) {
  const component = children || render;
  return useObserver(component);
}

export {ObserverComponent as Observer};
```

mobx-react-lite的observer则是相当于在useObserver的基础上再封装了一层forwardRef和memo。

实现代码如下：

```js
import React, {memo, forwardRef} from "react";
import {useObserver} from "./useObserver";

export function observer(baseComponent, options = {}) {
  let realOptions = {
    forwardRef: false,
    ...options
  };
  const useWrappedComponent = (props, ref) => {
    return useObserver(() => baseComponent(props, ref));
  };
  let memoComponent;
  if (realOptions.forwardRef) {
    memoComponent = memo(forwardRef(useWrappedComponent));
  } else {
    memoComponent = memo(useWrappedComponent);
  }
  return memoComponent;
}
```



### lesson7-详解mobx-react-lite的useAsObservableSource的使用场景及实现

**mobx-react-lite@1.3.0**

在不改变原先逻辑的基础上使用mobX。

```ts
useAsObservableSource<T>(state: T): T
```

#### action

action接收一个函数并返回具有同样签名的函数，但是用 `transaction`、`untracked` 和 `allowStateChanges` 包裹起来，尤其是 `transaction` 的自动应用会产生巨大的性能收益， 动作会分批处理变化并只在(最外层的)动作完成后通知计算值和反应。 这将确保在动作完成之前，在动作期间生成的中间值或未完成的值对应用的其余部分是不可见的。

建议对任何修改 observables 或具有副作用的函数使用 `(@)action` 。 结合开发者工具的话，动作还能提供非常有用的调试信息。

```js
import { observable, action } from "mobx"

const state = observable({ value: 0 })

const increment = action(state => {
    state.value++
    state.value++
})

increment(state)
```



#### runInAction(fn)

`runInAction` 是个简单的工具函数，它接收代码块并在(异步的)动作中执行。这对于即时创建和执行动作非常有用，例如在异步过程中。`runInAction(f)` 是 `action(f)()` 的语法糖。如参考上面action的例子，如果increment只用一次，不想再创建的话，就可以换成用下面的runInAction的写法了。

```js
import { observable } from "mobx"

const state = observable({ value: 0 })

runInAction(() => {
    state.value++
    state.value++
})
```

再参考个异步的例子，使用async/await + runInAction：

```jsx
import { runInAction, makeAutoObservable } from "mobx"

class Store {
    githubProjects = []
    state = "pending" // "pending" / "done" / "error"

    constructor() {
        makeAutoObservable(this)
    }

    fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        try {
            const projects = await fetchGithubProjectsSomehow()
            const filteredProjects = somePreprocessing(projects)
            runInAction(() => {
                this.githubProjects = filteredProjects
                this.state = "done"
            })
        } catch (e) {
            runInAction(() => {
                this.state = "error"
            }
        }
    )
}
```



#### 自己手动实现useAsObservableSource.js

```js
import React from "react";
import {observable, runInAction} from "mobx";

export function useAsObservableSource(current) {
  const [res] = React.useState(() => observable(current));

  runInAction(() => {
    Object.assign(res, current);
  });
  return res;
}
```



### lesson8-实现mobx-react-lite的useLocalStore

```ts
useLocalStore<T, S>(initializer: () => T, source?: S): T
```



#### transaction(事务)

*transaction 是底层 API，在绝大多数场景下 action 或 runInAction 会是更好的选择*

`transaction(worker: () => void)` 可以用来批量更新，在事务结束前不会通知任何观察者。 `transaction` 接收一个无参数的 `worker` 函数作为参数并运行它。 这个函数完成运行前不会通知任何观察者。 `transaction` 返回 `worker` 函数返回的任何值。 注意 `transaction` 完全是同步运行的。 Transactions 可以嵌套。只有在完成最外面的 `transaction` 后，其他等待的 reaction 才会运行。



#### 实现useLocalStore

```js
import React from "react";
import {observable, runInAction, transaction} from "mobx";
import {useAsObservableSource} from "./useAsObservableSource";

export function useLocalStore(initializer, current) {
  const source = useAsObservableSource(current);

  return React.useState(() => {
    const local = observable(initializer(source));
    runInAction(() => {
      Object.keys(local).forEach(key => {
        const value = local[key];
        if (typeof value === "function") {
          local[key] = wrapInTransaction(value, local);
        }
      });
    });
    return local;
  })[0];
}

function wrapInTransaction(fn, context) {
  return (...args) => transaction(() => fn.apply(context, args));
}
```



#### 例子

注意：useObserver能引起组件的整体渲染，如果想要局部控制的话，可以使用Observer Component。代码示例如下：

```jsx
import React from "react";

import {
  useLocalStore,
  useObserver,
  useAsObservableSource,
  Observer
} from "../k-mobx-react-lite/";

function UseLocalStore(props) {
  console.log("sss"); //sy-log
  const newProps = {...props}; // useAsObservableSource(props);
  // useLocalStore第一个参数是一个初始化函数，并且这个函数只会执行一次，并且在整个生命周期中都是有效的
  const countStore = useLocalStore(
    newProps => ({
      count: props.init === undefined ? 0 : props.init,
      add() {
        this.count = this.count + 1;
      },
      get emoji() {
        return this.count % 2 ? "😜" : "🏃";
      },
      get specialNum() {
        return newProps.init > -1 && newProps.init < 10
          ? "0" + newProps.init
          : newProps.init;
      }
    }),
    newProps
  );
  // return useObserver(() => (
  //   <div className="border">
  //     <h3>UseLocalStore</h3>
  //     <button onClick={countStore.add}>count: {countStore.count}</button>
  //     <p>{countStore.emoji}</p>
  //     <p>{countStore.specialNum}</p>
  //   </div>
  // ));

  // 局部控制
  return (
    <Observer>
      {() => (
        <div className="border">
          <h3>UseLocalStore</h3>
          <button onClick={countStore.add}>count: {countStore.count}</button>
          <p>{countStore.emoji}</p>
          <p>{countStore.specialNum}</p>
        </div>
      )}
    </Observer>
  );
}
export default UseLocalStore;
```





### lesson9-实现mobx-react的observer

mobx-react@6以后，mobx-react的observer中会判断下是否是函数组件，如果是函数组件，则用的还是mobx-react-lite中的observer，如果是类组件，则调用makeClassComponentObserver。

注意区分：目前mobx-react-lite@2.2中的observer有forwardRef配置项，但是目前mobx-react@6.3.0不支持，需要自己配置。

实现代码如下：

#### observer

```js
import React from "react";
import {observer as observerLite, Observer} from "../k-mobx-react-lite/";
import {makeClassComponentObserver} from "./observerClass";

export function observer(component, options) {
  // forwardRef
  if (component["$$typeof"] === Symbol.for("react.forward_ref")) {
    const baseRender = component["render"];
    return React.forwardRef(function() {
      const args = arguments;
      return <Observer>{() => baseRender.apply(undefined, args)}</Observer>;
    });
  }

  // 函数组件
  if (
    (typeof component === "function" && !component.prototype) ||
    !component.prototype.render
  ) {
    return observerLite(component, options);
  }
  // 类组件
  return makeClassComponentObserver(component);
}
```



#### makeClassComponentObserver

```js
import {Reaction} from "mobx";
import React, {Component} from "react";

export function makeClassComponentObserver(componentClass) {
  const target = componentClass.prototype;

  const baseRender = target.render;
  target.render = function() {
    return makeComponentReactive.call(this, baseRender);
  };
  return componentClass;
}

function makeComponentReactive(render) {
  const baseRender = render.bind(this);
  let isRenderingPending = false;
  const reaction = new Reaction(`${this.constructor.name}.render`, () => {
    if (!isRenderingPending) {
      isRenderingPending = true;
      Component.prototype.forceUpdate.call(this);
    }
  });

  this.render = reactiveRender;

  function reactiveRender() {
    isRenderingPending = false;
    let rendering = undefined;
    reaction.track(() => {
      rendering = baseRender();
    });

    return rendering;
  }

  return reactiveRender.call(this);
}
```



### lesson10-mobx-react的Provider、inject的使用

`Provider`是个能够传递store的组件，也支持传递其他非store数据，其实现机制就是React的Context跨层级传递。如果你有一些需要跨层级数据需要传递，可以考虑下这个组件。

`inject`可以用于提取你传输的数据的store，本质上是个高阶组件（hoc）。

参考下面的例子：

```jsx
@inject("color")
@observer
class Button extends React.Component {
    render() {
        return <button style={{ background: this.props.color }}>{this.props.children}</button>
    }
}

class Message extends React.Component {
    render() {
        return (
            <div>
                {this.props.text} <Button>Delete</Button>
            </div>
        )
    }
}

class MessageList extends React.Component {
    render() {
        const children = this.props.messages.map(message => <Message text={message.text} />)
        return (
            <Provider color="red">
                <div>{children}</div>
            </Provider>
        )
    }
}
```

注意：

- 读取Provider提供的数据不是非得用inject，用React.useContext(MobXProviderContext)也可以，MobXProviderContext来自mobx-react。
- 使用inject和observer的时候，注意顺序，observer应该是内部，inject在外面。



### lesson11-实现mobx-react的Provider、inject

Provider基于Context与组件复合

```js
import React, {useRef, useContext} from "react";
import {MobXProviderContext} from "./MobXProviderContext";

export function Provider({children, ...stores}) {
  const parentValue = useContext(MobXProviderContext);
  const mutableProvdierRef = useRef({...parentValue, ...stores});
  const value = mutableProvdierRef.current;

  return (
    <MobXProviderContext.Provider value={value}>
      {children}
    </MobXProviderContext.Provider>
  );
}
```

inject基于高阶组件

```js
import React, {useContext} from "react";
import {MobXProviderContext} from "./MobXProviderContext";

export const inject = (...storeNames) => component => {
  const Injector = React.forwardRef((props, ref) => {
    const context = useContext(MobXProviderContext);
    const newProps = {
      ...props,
      ...context
    };
    if (ref) {
      newProps.ref = ref;
    }
    return React.createElement(component, newProps);
  });

  return Injector;
};
```





### lesson12-实现mobx的observable

MobX 为现有的数据结构(如对象，数组和类实例)添加了可观察的功能，我们通过使用 observable就可以简单地完成这一切。

Observable 值可以是JS基本数据类型、引用类型、普通对象、类实例、数组和映射。

#### 实现observable

```js
export var observable = assign(createObservable, observableFactories)
```



#### 实现extendObservable

```ts
extendObservable(target, properties, decorators?, options?)
```

extendObservable用来向已存在的目标对象添加 observable 属性。 属性映射中的所有键值对都会导致目标上的新的 observable 属性被初始化为给定值。 属性映射中的任意 getters 都会转化成计算属性。

`decorators` 参数用来重载用于指定属性的装饰器，类似于 `decorate` 和 `observable.object` 。

```js
import {asObservableObject} from "./observableObject";
// import {makeProperty} from "./makeObservable";

export default function extendObservable(target, props) {
  // step1
  const adm = asObservableObject(target);

  // step2
  Object.keys(props).forEach(key => {
    // makeProperty(adm, target, key, props[key]);
    adm.addObservableProp_(key, props[key]);
  });

  return target;
}
```



























与observable无依赖关系

本地的observable state可以使用useLocalStore，但是记住一点就是对于每个组件实例，useLocalStore的**初始化函数只会执行一次**，并且是在组件的整个生命周期里都有效。

useLocalStore支持你传递一个非observable的plain object作为第二个参数存在这个store的衍生里，它可以是props、useContext甚至是useReducer。当然，这个参数必须得始终保持一种结构，不能用在条件语句中。

注：useLocalStore与useAsObservableSource的区别在于后者只能用于object，如果你不需要action和computed属性，那完全可以使用后者。

```tsx
import { observer, useLocalStore } from 'mobx-react' // 6.x

export const Counter = observer(props => {
  const store = useLocalStore(
    // don't ever destructure source, it won't work
    source => ({
      count: props.initialCount,
      get multiplied() {
        // you shouldn't ever refer to props directly here, it won't see a change
        return source.multiplier * store.count
      },
      inc() {
        store.count += 1
      },
    }),
    props, // note props passed here
  )
  return (
    <>
      <button id="inc" onClick={store.inc}>
        {`Count: ${store.count}`}
      </button>
      <span>{store.multiplied}</span>
    </>
  )
})
```



### lesson-13mobx与redux

#### mobx

它通过透明的函数响应式编程(transparently applying functional reactive programming - TFRP)使得状态管理变得简单和可扩展。MobX背后的哲学很简单:

*任何源自应用状态的东西都应该自动地获得。*

![MobX unidirectional flow](https://cn.mobx.js.org/flow.png)



#### redux

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。

![image-20200222151958879](https://tva1.sinaimg.cn/large/0082zybply1gc57dy6j70j31240netja.jpg)



Redux 除了和 [React](https://facebook.github.io/react/) 一起用外，还支持其它界面库。 它体小精悍（只有2kB，包括依赖）。

应用中所有的 state 都以一个对象树的形式储存在一个单一的 *store* 中。 惟一改变 state 的办法是触发 *action*，一个描述发生什么的对象。 为了描述 action 如何改变 state 树，你需要编写 *reducers*。

##### redux三大原则

###### 单一数据源

整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。

###### State 是只读的

唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

###### 使用纯函数来执行修改

为了描述 action 如何改变 state tree ，你需要编写 reducers。



#### 不同

##### 设计思想不同

Redux遵循函数式编程（Functional Programming, FP）思想，而MobX设计更多偏向于面向对象编程（OOP）和响应式编程（Reactive Programming），MobX中将状态包装成可观察对象，再使用可观察对象的所有能力，一旦状态对象变更，更新就能被自动获得。



##### 对store管理的不同

在Redux应用中，所有共享的应用数据都集中在一个大的store中，而MboX则通常按模块将应用状态划分，在多个独立的store中管理。



##### 工作方式不同

Redux中用js对象存储状态数据，并且手动追踪状态变更，而MobX中会把状态数据转化为可观察的对象，当状态发生变化，自动触发监听。



##### 状态修改方式

Redux中的不可以直接修改状态，只能通过dispatch派发事件修改，而MobX中则可以直接修改，也可以通过action修改，比较”灵活“，但是这种灵活不利于项目管理与维护，因此建议还是开启严格模式，从而禁止掉直接修改状态的方式，并且制定状态管理规范。



##### 不可变（Immutable）和可变（Mutable）

Redux状态对象通常是不可变的（Immutable），我们使用reducers，并且在原来对象的基础上返回一个新的状态对象，这样就能很方便的返回上一个状态，但是MobX中则可由直接使用新值更新状态对象。



##### mobx-react和react-reudx

各自都有React绑定库，且绑定库设计与思想相似，react-redux中有Provider与connect，mobx-react中有Provider和inject，都有Context和HOC设计，后期都可以用hooks代替。



##### 体积不同

Redux体小精悍、周边配合库非常丰富，如redux-thunk中间件等。mobx库则功能强大，自己就能独立完成很多功能，如异步等。



#### 总结

如果你不懂Redux中的reducers、中间件等这些概念，`MobX`入门也许相对简单，构建项目当然也很快，但是当项目足够大的时候，其实难度不会天差地别，都需要开发者对库本身能有深刻的理解。目前更多人选择使用Redux，尤其是大型项目，而选择MobX的则中小型项目多一些，MobX好理解、自由，这当然是个优势，但是同时也带来了劣势，过于自由对于项目管理当然是巨大的缺点，因此使用MobX需要开发者约定规范。所以，我个人认为，选择MobX还是Redux用于状态管理，或者你有第三第四个别的选择，根据自己的项目和个人对于各自库的掌握度来做选择就可以了。

































