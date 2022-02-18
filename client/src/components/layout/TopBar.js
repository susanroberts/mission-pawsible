import React from "react";
import { Link } from "react-router-dom";
import SignOutButton from "../authentication/SignOutButton"

import sleepy_dog from "../../../public/sleepy_dog.png"

const TopBar = ({ user }) => {
  const unauthenticatedListItems = [
    <li key="sign-in">
      <Link to="/user-sessions/new">Sign In</Link>
    </li>,
    <li key="sign-up">
      <Link to="/users/new" className="button">
        Sign Up
      </Link>
    </li>,
  ];

  const authenticatedListItems = [
    <li key="sign-out">
      <SignOutButton />
    </li>,
  ];

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <Link to="/"><img src={sleepy_dog} className="logo bottom"/></Link>
        <h1 className="inline bottom">Mission Pawsible: Home Alone</h1>
        <ul className="menu">
          <li>
            <Link to="/dashboard">Home</Link>
          </li>
          <li>
            <Link to="/missions/new">New Mission</Link>
          </li>
          <li>
            <Link to="/missions">All missions</Link>
          </li>
        </ul>
      </div>
      <div className="top-bar-right">
        <ul className="menu">{user ? authenticatedListItems : unauthenticatedListItems}</ul>
      </div>
    </div>
  );
};

export default TopBar;
