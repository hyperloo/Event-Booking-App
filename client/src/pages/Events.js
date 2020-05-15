import React, { Component } from "react";
import axios from "axios";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop";
import AuthContext from "../context/auth-context";
import EventsList from "../components/Events/List";
import Error from "../components/ActionHandler";
import "./Events.scss";

class Events extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    stat: false,
  };

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = async () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query{
          events{
            _id
            title
            description
            date
            price
            creator{
              _id
              email
            }
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
        },
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      this.setState({ isLoading: false });
      throw new Error("Failed");
    }

    this.setState({ events: response.data.data.events, isLoading: false });
  };

  static contextType = AuthContext;

  titleEl = React.createRef();
  priceEl = React.createRef();
  dateEl = React.createRef();
  timeEl = React.createRef();
  descriptionEl = React.createRef();

  startCreateEventHandler = () => {
    // this.context.status = false;
    // this.context.errors = null;
    this.setState((prevState) => {
      return {
        creating: !prevState.creating,
        stat: false,
      };
    });
  };

  modalConfirmHandler = async () => {
    this.context.createError(false, null);
    this.setState({ creating: false, isLoading: true });
    const title = this.titleEl.current.value,
      date = this.dateEl.current.value,
      time = this.timeEl.current.value,
      price = this.priceEl.current.value,
      description = this.descriptionEl.current.value;

    if (
      title.trim().length === 0 ||
      date.trim().length === 0 ||
      time.trim().length === 0 ||
      price.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const event = {
      title,
      date: `${date}T${time}`,
      price: +price,
      description,
    };
    // console.log(event);

    const requestBody = {
      query: `
        mutation{
          createEvent(eventInput:{title:"${title}", description:"${description}", price: ${event.price} , date:"${event.date}" }){
            _id
            title
            description
            date
            price
            creator{
              _id
              email
            }
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
          "x-auth-token": `${this.context.token}`,
        },
      }
    );

    // if (response.status !== 200 && response.status !== 201) {
    //   this.setState({ creating: false, isLoading: false });
    //   throw new Error("Failed");
    // }
    console.log(response);
    if (response.data.errors) {
      this.setState({
        creating: false,
        isLoading: false,
      });
      this.context.createError(false, response.data.errors[0].message);
    } else {
      const resData = response.data.data.createEvent;
      // console.log("front-end createEvent response", resData);
      this.setState((prevState) => {
        return {
          events: [
            ...prevState.events,
            {
              ...resData,
              creator: {
                _id: this.context.userId,
                email: resData.creator.email,
              },
            },
          ],
          creating: false,
          isLoading: false,
        };
      });
      this.context.createError(true, "Event Added Successfully");
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && (
          <React.Fragment>
            <Backdrop onCancel={this.startCreateEventHandler} />
            <Modal
              title="Add Event"
              sub="Confirm Event"
              canCancel
              canConfirm
              onCancel={this.startCreateEventHandler}
              onConfirm={this.modalConfirmHandler}
            >
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" ref={this.titleEl}></input>
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="text" id="price" ref={this.priceEl}></input>
                </div>
                <div className="form-control" id="datetime">
                  <label htmlFor="date">Date & Time</label>
                  <section className="date">
                    <input type="date" ref={this.dateEl}></input>
                    <input type="time" ref={this.timeEl}></input>
                  </section>
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea
                    rows="4"
                    id="description"
                    ref={this.descriptionEl}
                  />
                </div>
              </form>
            </Modal>
          </React.Fragment>
        )}
        {this.context.errors && (
          <Error status={this.context.status} error={this.context.errors} />
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share Your Own Events!</p>
            <button
              onClick={() => {
                this.context.createError(false, null);
                this.startCreateEventHandler();
              }}
            >
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <div id="loading">
            <div className="loader"></div>
          </div>
        ) : (
          <EventsList
            events={this.state.events}
            authorId={this.context.userId}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Events;
