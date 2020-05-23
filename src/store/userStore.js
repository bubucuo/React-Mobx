import {observable, action, computed} from "mobx";
import LoginService from "../service/login";

class UserStore {
  @observable basicInfo = {
    loading: false,
    name: "",
    err: {msg: ""}
  };
  @computed get isLogin() {
    return !!this.basicInfo.name;
  }
  @action login(userInfo) {
    this.basicInfo = {
      ...this.basicInfo,
      loading: true
    };
    LoginService.login(userInfo).then(
      res => {
        this.basicInfo = {
          loading: false,
          err: {msg: ""},
          ...res
        };
      },
      err => {
        this.basicInfo = {
          loading: false,
          ...err
        };
      }
    );
  }
}

const user = new UserStore();

export default user;
