import React, { useState, useEffect, useContext, createContext } from "react";

export const Context = createContext();

export const Provider = props => {
  const { children } = props;

  const [authUser, setAuthUser] = useState(false);

  const logOut = () => {
    setAuthUser(false);
  };

  const isAuth = () => {
    return authUser
  }

  const logIn = () => {setAuthUser(true)};

  const authContext = {
    authUser,
    logOut,
    logIn,
    isAuth
  };

  return <Context.Provider value={authContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

export const useAuthContext = () => useContext(Context);
