import React from "react";

export default React.createContext({
  token: null,
  userId: null,
  login: (token, userId, errors) => {},
  logout: () => {},
  createError: (status, errors) => {},
  status: false,
  errors: null,
});
