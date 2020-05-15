import React from "react";

import "./Action.scss";

const Action = ({ error, status }) => {
  return (
    <div
      className="errorBox"
      style={
        status
          ? {
              backgroundColor: "rgba(0, 200, 81, 0.51)",
              border: "3px solid #007E33",
            }
          : {
              backgroundColor: "rgba(237, 67, 55, 0.43)",
              border: "3px solid red",
            }
      }
    >
      <p>{error}</p>
    </div>
  );
};

export default Action;
