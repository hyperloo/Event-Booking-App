import React from "react";
import AuthContext from "../../../../context/auth-context";

import "./Item.scss";

const Item = ({ event, userId, modalToggler }) => {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <li key={event._id} className="item">
            {/* {console.log("Events in Modal", event)} */}
            <div>
              <h2>{event.title}</h2>
              <h3>
                ${event.price} - {new Date(event.date).toLocaleDateString()}
              </h3>
              <h4>Created by: {event.creator.email.split("@")[0]}</h4>
            </div>
            <div className="rightSec">
              <button
                onClick={() => {
                  context.createError(false, null);
                  modalToggler();
                }}
              >
                View Details
              </button>
              {/* {console.log("creator id", event.creator._id, "login user", userId)} */}
              {/* {event.creator._id === userId && (
            <p>You are the creator of the event.</p>
          )} */}
            </div>
          </li>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default Item;
