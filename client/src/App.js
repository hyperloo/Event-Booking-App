import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";

import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingsPage from "./pages/Bookings";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

import "./App.scss";

class App extends React.Component {
  state = {
    token: localStorage.getItem("token"),
    userId: null,
    status: false,
    errors: null,
  };

  //This is to get the user details by passing token from local storage to backend which then sends back the response and update state at first time the app loads so that
  loadUser = async () => {
    const requestBody = {
      query: `query{
          user{
            _id
            email
          }
        }
      `,
    };
    let response;
    try {
      response = await axios.post(
        "https://myeventbookingapp.herokuapp.com/graphql",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": `${this.state.token}`,
          },
        }
      );
      // console.log("loadUser", response);
      // console.log("state before status check", this.state);

      // console.log("before status check loop", response);
      if (response.status !== 200 && response.status !== 201) {
        // console.log("state inside status check", this.state);
        // console.log("inside status check loop", response);
        localStorage.removeItem("token");
        this.setState({ token: null, isLoading: false });
        throw new Error("Failed");
      }
      // if (response.data.errors) {
      //   await localStorage.removeItem("token");
      //   await this.setState({
      //     isLoading: false,
      //     token: null,
      //   });
      // throw new Error("Failed")
      // }
      else {
        // console.log("state after status check", this.state);
        // console.log("after status check loop", response);

        const resData = response.data;
        const loadedUser = resData.data.user._id.toString();
        // const name = resData.data.user.email.split("@")[0];

        // console.log("user name from did mount", name, typeof name);
        this.setState({
          userId: loadedUser,
        });
        // console.log("state after update", this.state);
      }
    } catch (err) {
      // console.log(err);
      throw err;
    }
  };

  // loadUser = async () => {
  //   const response = await axios.get("http://localhost:3000/user", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-auth-token": `${this.state.token}`,
  //     },
  //   });
  //   const resData = response.data;
  //   if (resData.err) {
  //     await localStorage.removeItem("token");
  //     await this.setState({
  //       isLoading: false,
  //       token: null,
  //     });
  //   } else {
  // console.log(resData);
  //   }
  // };

  async componentDidMount() {
    // console.log("DidMount");
    await this.loadUser();
  }

  // This function declaration can also be done inside context file
  //But for a better auto completion, is declared inside parent component

  //declaring login function for the context
  login = (token, userId, errors) => {
    this.setState({
      token: token,
      userId: userId,
      status: true,
      errors: errors,
    });
  };

  //declaring logout function for the context
  logout = () => {
    localStorage.removeItem("token");
    this.setState({
      token: null,
      userId: null,
      status: true,
      errors: "Logout Successful",
    });
  };

  createError = (status, errors) => {
    this.setState({
      status: status,
      errors: errors,
    });
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            //Passing values to the context
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
            createError: this.createError,
            status: this.state.status,
            errors: this.state.errors,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {!this.state.token && <Redirect from="/" to="/auth" exact />}
              {this.state.token && <Redirect from="/" to="/events" exact />}

              {this.state.token && <Redirect from="/auth" to="/events" exact />}
              {!this.state.token && (
                <Route path="/auth" exact component={AuthPage} />
              )}

              <Route path="/events" exact component={EventsPage} />

              {this.state.token && (
                <Route path="/bookings" exact component={BookingsPage} />
              )}
              {!this.state.token && (
                <Redirect from="/bookings" to="/auth" exact />
              )}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
