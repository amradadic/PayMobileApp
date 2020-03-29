import React, { useState, useContext, createContext } from "react";
import axios from "axios";
import { BASE_URL } from "../app/apiConfig";

export const Context = createContext();

export const Provider = props => {
  const { children } = props;

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logOut = () => {
    setToken(null);
    setError(null);
    setLoading(false);
  };

  const isAuth = () => {
    return !!token;
  };

  const logIn = async (usernameOrEmail, password) => {
    try {
      setError(null);
      setToken(null);
      setLoading(true);
      const data = await axios.post(`${BASE_URL}api/auth/signin`, {
        usernameOrEmail,
        password
      });
      setToken(data);
      return true;
    } catch (error) {
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const authContext = {
    logOut,
    logIn,
    isAuth,
    loading,
    error    
  };

  return <Context.Provider value={authContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

export const useAuthContext = () => useContext(Context);
