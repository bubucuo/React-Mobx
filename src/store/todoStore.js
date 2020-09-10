import {observable, computed, autorun, action, configure} from "mobx";

// 配置configure， 不允许我们在动作（action）外修改状态
configure({enforceActions: true});

class TodoStore {
  @observable todos = [
    {
      id: "0",
      finished: false,
      title: "事件1"
    },
    {
      id: "1",
      finished: true,
      title: "事件2"
    },
    {
      id: "2",
      finished: false,
      title: "事件3"
    }
  ];

  @computed get unfinishedCount() {
    return this.todos.filter(todo => !todo.finished).length;
  }
  @action change(todo) {
    todo.finished = !todo.finished;
  }
}

const todoStore = new TodoStore();

autorun(() => {
  console.log("剩余任务：", todoStore.unfinishedCount); //sy-log
});

export default todoStore;
