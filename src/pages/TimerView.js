import React, {Component} from "react";
import {observer} from "mobx-react";

// step2. 创建视图 以响应状态的变化
@observer
class TimerView extends Component {
  onReset = () => {
    this.props.appState.resetTimer();
  };
  render() {
    return (
      <div>
        <h3>TimerView</h3>
        <button onClick={this.onReset}>{this.props.appState.timer}</button>
      </div>
    );
  }
}
export default TimerView;
