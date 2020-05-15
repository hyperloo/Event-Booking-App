import React, { Component } from "react";
import axios from "axios";

import "./Auth.scss";
import AuthContext from "../context/auth-context";
import Error from "../components/ActionHandler";

class Auth extends Component {
  state = { isLogin: true, isLoading: false, stat: false };

  //in class based components, auth context is invoked using static datatype
  // and then the values of 'context store' can be accessed using 'context' keyword

  static contextType = AuthContext;

  emailEl = React.createRef();
  passwordEl = React.createRef();

  switchHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = async (e) => {
    e.preventDefault();

    this.setState({ isLoading: true });

    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    console.log(email, password);
    const requestBody = {
      query: this.state.isLogin
        ? `query{
        login(email:"${email}", password:"${password}"){
          userId
          token
          tokenExpiration
        }
      }`
        : `
        mutation{
          createUser(userInput:{email:"${email}", password:"${password}"}){
            _id
            email
            token
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
          },
        }
      );
      // console.log(response);

      // if (response.status !== 200 && response.status !== 201) {
      //   this.setState({ isLoading: false });
      //   throw new Error("Failed");
      // }
      if (response.data.errors) {
        this.setState({
          isLoading: false,
        });
        this.context.createError(false, response.data.errors[0].message);
      } else {
        const resData = response.data;

        if (this.state.isLogin) {
          this.setState({
            isLoading: false,
          });
          if (resData.data.login.token) {
            localStorage.setItem("token", `${resData.data.login.token}`);
            this.context.login(
              resData.data.login.token,
              resData.data.login.userId,
              "Login Successful"
            );
          }
        } else {
          this.context.status = true;
          this.context.errors = "Signup Successful";
          this.setState({
            isLoading: false,
          });
          localStorage.setItem("token", `${resData.data.createUser.token}`);
          this.context.login(
            resData.data.createUser.token,
            resData.data.createUser._id.toString(),
            "SignUp Successful"
          );
        }
      }
    } catch (err) {
      this.setState({ isLoading: false });
      // console.log(err);
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="heading">
          <h2>Welcome</h2>
          <h1>The Event Booking App</h1>
          <h3>Built Using Graphql and MERN Stack</h3>
        </div>
        <form className="auth-form" onSubmit={this.submitHandler}>
          {this.context.errors && (
            <Error status={this.context.status} error={this.context.errors} />
          )}
          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              if="email"
              ref={this.emailEl}
              onChange={() => {
                this.context.errors = null;
                this.setState({ stat: false });
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              if="password"
              ref={this.passwordEl}
              onChange={() => {
                this.context.errors = null;
                this.setState({ stat: false });
              }}
            />
          </div>
          <div className="form-actions">
            <button type="submit">
              {this.state.isLogin ? "Login" : "SignUp"}{" "}
              {this.state.isLoading && (
                <i className="fa fa-circle-o-notch fa-spin"></i>
              )}
            </button>
            <button type="button" onClick={this.switchHandler}>
              Switch to {this.state.isLogin ? "SignUp" : "Login"}
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default Auth;
