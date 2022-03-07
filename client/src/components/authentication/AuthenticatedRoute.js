import React from "react";
import { Route } from "react-router";

import MustLogIn from "../content/MustLogIn";

const AuthenticationCheck = ({ component: Component, user }) => {
  if (user === undefined) {
    return <div>Loading...</div>
  }
  if (user !== null) {
    return <Component user={user}/>;
  }
  return <MustLogIn />;
};

const AuthenticatedRoute = ({ component, user, ...rest }) => {
  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      <AuthenticationCheck user={user} component={component} />
    </Route>
  );
};

export default AuthenticatedRoute;