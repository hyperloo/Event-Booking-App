import React, { useState } from "react";
import axios from "axios";
import AuthContext from "../../../context/auth-context";
import Error from "../../ActionHandler";

import "./List.scss";

const List = ({ bookings, changeBookings }) => {
  const [isLoading, toggleLoading] = useState(false);
  const [newBookings, updateBookings] = useState(bookings);
  const [deleteId, updateDeleteId] = useState(null);
  const [detailId, updateDetailId] = useState(null);
  const [detailsDiv, toggleDiv] = useState(false);
  const [isDisabled, toggleDisabled] = useState(false);

  const onDelete = async (id, token, createError) => {
    toggleLoading(true);
    updateDeleteId(id);
    const requestBody = {
      //Another Syntax by declaring mutation/query type and passing arguments which are variables with '$' (like $bid) with their datatype (like ID!) and we can use the
      //assigned variable in query without using quotes ' " " ' and then pass second property to request body as variables : {variable (same name as in argument without '$') : value}

      query: `
        mutation CancelBooking($bid: ID!){
          cancelBooking(bookingId: $bid){
            _id
            title
          }
        }`,
      variables: {
        bid: id,
      },
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
    //   updateDeleteId(null);
    //   throw new Error("Failed");
    // }

    if (response.data.errors) {
      this.setState({
        isLoading: false,
      });
      createError(false, response.data.errors[0].message);
    } else {
      const updatedBookings = await newBookings.filter((booking) => {
        return booking._id !== id;
      });
      changeBookings(id);
      updateBookings(updatedBookings);
      toggleLoading(false);
      updateDeleteId(null);
      createError(true, "Event Deleted SuccessFully");
    }
  };

  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <ul className="bookings-list">
            {context.errors && (
              <Error status={context.status} error={context.errors} />
            )}
            {newBookings.length === 0 ? (
              <li
                style={{
                  textAlign: "center",
                  fontSize: "35px",
                  fontWeight: "bold",
                }}
              >
                No Booking Yet Done
              </li>
            ) : (
              newBookings.map((booking) => (
                <li key={booking._id} className="item">
                  <div className="controlDiv">
                    <h2>{booking.event.title}</h2>
                    <div className="actions">
                      <button
                        onClick={() => {
                          if (detailId === booking._id) {
                            updateDetailId(null);
                            toggleDiv(false);
                          } else {
                            updateDetailId(booking._id);
                            toggleDiv(true);
                          }
                        }}
                        style={{ marginRight: "0.5rem" }}
                      >
                        <i className="fa fa-info-circle"></i>
                      </button>
                      <button
                        onClick={() => {
                          toggleDisabled(true);
                          onDelete(
                            booking._id,
                            context.token,
                            context.createError
                          );
                        }}
                        disabled={isDisabled}
                      >
                        {isLoading && deleteId === booking._id ? (
                          <i className="fa fa-circle-o-notch fa-spin"></i>
                        ) : (
                          <span>&#128465;</span>
                        )}
                      </button>
                    </div>
                  </div>
                  <div
                    className={`active ${
                      detailsDiv && detailId === booking._id ? "" : "inactive"
                    } `}
                  >
                    <div>
                      <h3>
                        <p>
                          <b>{booking.event.title}</b> for $
                          <i>{booking.event.price} </i>
                        </p>
                        -{" "}
                        <p>
                          {new Date(booking.event.date).toLocaleDateString()}
                        </p>
                      </h3>
                      <div className="hr"></div>
                      <p>{booking.event.description}</p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default List;
