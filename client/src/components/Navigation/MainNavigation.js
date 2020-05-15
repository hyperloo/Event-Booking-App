import React from "react";
import { NavLink } from "react-router-dom";

import "./MainNavigation.scss";
import AuthContext from "../../context/auth-context";
import Spinner from "../spinner";

const MainNavigation = () => {
  //function based component do not have a 'static' type to which this context has to be assigned
  // therefore, AuthContext.Consumer is used which a function is automatically invoked with a
  // a parameter of 'context' through which one can access the 'context store values'
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="main-navigation">
            <div className="logo">
              <h1>EasyEvent</h1>
            </div>
            <div className="items">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                  </li>
                )}

                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                {context.token && (
                  <React.Fragment>
                    <li>
                      <NavLink to="/bookings">Booking</NavLink>
                    </li>
                    <li>
                      <button onClick={context.logout}>
                        <i class="fa fa-power-off"></i>
                      </button>
                    </li>
                  </React.Fragment>
                )}
              </ul>
            </div>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default MainNavigation;
