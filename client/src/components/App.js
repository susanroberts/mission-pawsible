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
        <Route exact path="/dashboard">
          <Dashboard user={currentUser} />
        </Route>
        <Route exact path="/users/new" component={RegistrationForm} />
        <Route exact path="/user-sessions/new" component={SignInForm} />
        <Route exact path="/missions">
          <MissionList user={currentUser} />
        </Route>
        <Route exact path="/missions/new">
          <MissionForm user={currentUser} />
        </Route>
        <Route exact path="/missions/:missionId">
          <MissionShow user={currentUser} />
        </Route>
      </Switch>
    </Router>
  );
};

export default hot(App);
