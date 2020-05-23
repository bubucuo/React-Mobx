import React from "react";
import {inject} from "mobx-react";
import {Route, Redirect} from "react-router-dom";

function PrivateRoute({user, component: Component, ...rest}) {
  return (
    <Route
      {...rest}
      render={props =>
        user.isLogin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: {from: props.location}
            }}
          />
        )
      }
    />
  );
}

export default inject("user")(PrivateRoute);
