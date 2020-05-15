import React from "react";

const Backdrop = ({ onCancel }) => (
  <div
    style={{
      position: "fixed",
      top: "0",
      left: "0",
      height: "100vh",
      width: "100%",
      background: "rgba(0,0,0,0.75)",
    }}
    onClick={onCancel}
  ></div>
);

export default Backdrop;
