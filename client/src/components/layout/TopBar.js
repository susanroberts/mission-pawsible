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
      <Link to="/users/new" className="ivory button">
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
        <div className="inline">
          <Link to="/"><img src={sleepy_dog} className="logo"/></Link>
        </div>
        <div className="inline">
          <div className="block">
            <h1 className="title">Mission Pawsible: Home Alone</h1>
            <ul className="menu">
              <li className="bold">
                <Link to="/dashboard">Home</Link>
              </li>
              <li className="bold">
                <Link to="/missions/new">New Mission</Link>
              </li>
              <li className="bold">
                <Link to="/missions">All missions</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="top-bar-right">
        <ul className="menu bold">{user ? authenticatedListItems : unauthenticatedListItems}</ul>
      </div>
    </div>
  );
};

export default TopBar;
