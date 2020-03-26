import React, { useState, useEffect, useContext, createContext } from "react";

export const Context = createContext();

export const Provider = props => {
  const { children } = props;

  const [authUser, setAuthUser] = useState(null);

  const logOut = () => {
    setAuthUser(null);
  };

  const logIn = () => {};

  const authContext = {
    authUser,
    logOut,
    logIn
  };

  return <Context.Provider value={authContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

export const useAuthContext = () => useContext(Context);
