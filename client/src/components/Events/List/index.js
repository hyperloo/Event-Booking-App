import React, { useState, useEffect } from "react";
import Item from "./Item";
import Modal from "../../Modal/Modal";
import Backdrop from "../../Backdrop";
import axios from "axios";
import AuthContext from "../../../context/auth-context";

import "./List.scss";

const List = ({ events, authorId }) => {
  const [Event, changeEvent] = useState(null);
  const [isOpen, toggleModal] = useState(false);
  const [isLoading, toggleLoading] = useState(false);

  const ModalToggler = (event) => {
    changeEvent(event);
    toggleModal(true);
  };

  const BookEvent = async (token, createError) => {
    toggleLoading(true);
    if (!token) {
      changeEvent(null);
      toggleLoading(false);
      return;
    }
    const requestBody = {
      query: `
            mutation{
                bookEvent(eventId: "${Event._id}"){
                    _id
                    createdAt
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
          "x-auth-token": `${token}`,
        },
      }
    );

    // if (response.status !== 200 && response.status !== 201) {
    //   toggleLoading(false);
    //   changeEvent(null);
    //   toggleModal(false);
    //   throw new Error("Failed");
    // }

    if (response.data.errors) {
      toggleLoading(false);
      changeEvent(null);
      toggleModal(false);
      this.context.createError(false, response.data.errors[0].message);
    } else {
      // const resData = response.data;
      toggleLoading(false);
      changeEvent(null);
      toggleModal(false);
      createError(true, "Event Booked Successfully");
      // console.log(resData);
    }
  };

  useEffect(() => {}, []);

  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <React.Fragment>
            {isOpen && Event && (
              <React.Fragment>
                <Backdrop
                  onCancel={() => {
                    toggleModal(false);
                    changeEvent(null);
                  }}
                />
                <Modal
                  title={Event.title}
                  sub="Book Event"
                  canCancel
                  canConfirm={
                    !(
                      context.userId === Event.creator._id ||
                      context.userId === null
                    )
                  }
                  onCancel={() => {
                    toggleModal(false);
                    changeEvent(null);
                  }}
                  isLoading
                  onConfirm={() =>
                    BookEvent(context.token, context.createError)
                  }
                >
                  <div className="inner">
                    <h1>{Event.title}</h1>
                    <h2>Created By: {Event.creator.email.split("@")[0]}</h2>
                    <h3>
                      ${Event.price} -{" "}
                      {new Date(Event.date).toLocaleDateString()}
                    </h3>
                    <p>{Event.description}</p>
                  </div>
                </Modal>
              </React.Fragment>
            )}
            <ul className="events-list">
              {events.map((event) => (
                <Item
                  key={event._id}
                  event={event}
                  userId={authorId}
                  modalToggler={() => ModalToggler(event)}
                />
              ))}
            </ul>
          </React.Fragment>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default List;
