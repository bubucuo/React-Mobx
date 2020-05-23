import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {inject, observer} from "mobx-react";

@inject("user")
@observer
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {name: ""};
  }
  render() {
    const {user, location} = this.props;
    const {from = "/"} = location.state || {};
    if (user.isLogin) {
      return <Redirect to={from} />;
    }
    return (
      <div>
        <h3>LoginPage</h3>
        <input
          value={this.state.name}
          onChange={e => this.setState({name: e.target.value})}
        />
        <button onClick={() => user.login({name: this.state.name})}>
          {user.basicInfo.loading ? "loading..." : "login"}
        </button>
        <p className="red">{user.basicInfo.err.msg}</p>
      </div>
    );
  }
}
export default LoginPage;
