import React, {Component} from "react";
import {inject, observer} from "mobx-react";

@inject("user")
class UserPage extends Component {
  render() {
    return (
      <div>
        <h3>UserPage</h3>
        <p>姓名：{this.props.user.basicInfo.name}</p>
      </div>
    );
  }
}
export default UserPage;
