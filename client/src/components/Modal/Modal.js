import React from "react";
import AuthContext from "../../context/auth-context";

import "./Modal.scss";

const Modal = ({
  title,
  children,
  sub,
  canCancel,
  canConfirm,
  onCancel,
  onConfirm,
}) => {
  const [isDisabled, toggleDisabled] = React.useState(false);
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <div className="modal">
            <header>
              <h1>{title}</h1>
            </header>
            <section className="content">{children}</section>
            <section className="actions">
              {canCancel && <button onClick={onCancel}>Cancel</button>}
              {canConfirm && (
                <button
                  onClick={() => {
                    if (!isDisabled) {
                      toggleDisabled(true);
                    }

                    onConfirm();
                  }}
                  disabled={isDisabled}
                >
                  {sub}
                </button>
              )}
            </section>
          </div>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default Modal;
