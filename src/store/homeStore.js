import {observable, action, computed} from "mobx";

class HomeStore {
  @observable count = 0;
  @observable todos = [
    {
      id: "0",
      finised: false,
      title: "事件1"
    },
    {
      id: "1",
      finised: true,
      title: "事件2"
    },
    {
      id: "2",
      finised: true,
      title: "事件3"
    }
  ];
  @action add() {
    this.count = this.count + 1;
  }
  @action minus() {
    this.count = this.count - 1;
  }
  @computed get unfinishedLength() {
    return this.todos.filter(todo => !todo.finised).length;
  }
}

const home = new HomeStore();

export default home;
