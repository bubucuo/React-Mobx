import {observable, action, computed} from "mobx";

class HomeStore {
  @observable num = 0;
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
  @action add() {
    this.num += 1;
  }
  @action minus() {
    this.num -= 1;
  }
  @computed get checkedLength() {
    return this.todos.filter(todo => todo.checked).length;
  }
}

const home = new HomeStore();

export default home;
