import React, { useState, useContext, createContext } from "react";
import axios from "axios";
import { BASE_URL } from "../app/apiConfig";
import { updateLatestUser } from "../helperFunctions";

export const Context = createContext();

export const Provider = props => {
  const { children } = props;

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logOut = async () => {
    setToken(null);
    setError(null);
    setLoading(false);
    // await updateLatestUser("", "");
  };

  const logIn = async (usernameOrEmail, password) => {
    try {
      setError(null);
      setToken(null);
      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}api/auth/signin`, {
        usernameOrEmail,
        password
      });
      setToken(data);
      await updateLatestUser(usernameOrEmail, password);
      return true;
    } catch (error) {
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const authContext = {
    token,
    logOut,
    logIn,
    loading,
    error
  };

  return <Context.Provider value={authContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

export const useAuthContext = () => useContext(Context);
