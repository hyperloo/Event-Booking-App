import React, { Component } from "react";
import axios from "axios";
import AuthContext from "../context/auth-context";
import BookingList from "../components/Bookings/List";
import BookingsChart from "../components/Bookings/Chart";

import "./Bookings.scss";

class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: "list",
    stat: false,
  };
  static contextType = AuthContext;

  async componentDidMount() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query{
          bookings{
            _id
            createdAt
            event{
              _id
              title
              date
              description
              price
            }
            updatedAt
          }
        }
      `,
    };

    const response = await axios.post(
      "https://myeventbookingapp.herokuapp.com/graphql",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${this.context.token}`,
          "x-auth-token": `${this.context.token}`,
        },
      }
    );
    // if (response.status !== 200 && response.status !== 201) {
    //   this.setState({ isLoading: false });
    //   throw new Error("Failed");
    // }

    if (response.data.errors) {
      this.context.status = false;
      this.context.errors = response.data.errors[0].message;
      this.setState({
        isLoading: false,
      });
    } else {
      const resData = response.data.data.bookings;
      this.setState({ isLoading: false, bookings: resData });
    }
    // console.log(resData);
  }

  outputTypeHandler = (type) => {
    this.setState({ outputType: type });
  };

  changeBookings = async (id) => {
    var newBookings = [...this.state.bookings];
    newBookings = await newBookings.filter((booking) => booking._id !== id);
    this.setState({ bookings: newBookings });
  };

  render() {
    const SpinnerList = () => {
      return this.state.isLoading ? (
        <div id="loading">
          <div className="loader"></div>
        </div>
      ) : (
        <React.Fragment>
          <div className="controlButton">
            <button
              className={this.state.outputType === "list" ? "active" : ""}
              onClick={() => this.outputTypeHandler("list")}
            >
              List
            </button>
            <button
              className={this.state.outputType === "graph" ? "active" : ""}
              onClick={() => this.outputTypeHandler("graph")}
            >
              Graph
            </button>
          </div>
          <div>
            {this.state.outputType === "list" ? (
              <ul>
                <BookingList
                  bookings={this.state.bookings}
                  changeBookings={this.changeBookings}
                />
              </ul>
            ) : (
              <BookingsChart bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    };

    return (
      <div>
        <SpinnerList />
      </div>
    );
  }
}

export default Bookings;
