import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { hot } from "react-hot-loader/root";

import getCurrentUser from "../services/getCurrentUser";
import "../assets/scss/main.scss";
import RegistrationForm from "./registration/RegistrationForm";
import SignInForm from "./authentication/SignInForm";
import TopBar from "./layout/TopBar";
import MissionForm from "./content/MissionForm";
import MissionList from "./content/MissionList";
import MissionShow from "./content/MissionShow";
import Dashboard from "./content/Dashboard";
import SplashPage from "./content/SplashPage";
import AuthenticatedRoute from "./authentication/AuthenticatedRoute";

const App = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch(err) {
      setCurrentUser(null)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <Router>
      <TopBar user={currentUser} />
      <Switch>
        <Route exact path="/" component={SplashPage} />
        <AuthenticatedRoute
          exact path="/dashboard"
          component={Dashboard}
          user={currentUser}
        />
        <Route exact path="/users/new" component={RegistrationForm} />
        <Route exact path="/user-sessions/new" component={SignInForm} />
        <AuthenticatedRoute
          exact path="/missions"
          component={MissionList}
          user={currentUser}
        />
        <AuthenticatedRoute
          exact path="/missions/new"
          component={MissionForm}
          user={currentUser}
        />
        <AuthenticatedRoute
          exact path="/missions/:missionId"
          component={MissionShow}
          user={currentUser}
        />
      </Switch>
    </Router>
  );
};

export default hot(App);
