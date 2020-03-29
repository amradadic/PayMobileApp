import React, { useState, useContext, createContext } from "react";
import axios from "axios";
import { BASE_URL } from "../app/apiConfig";

export const Context = createContext();

export const Provider = props => {
  const { children } = props;

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState("");

  const logOut = () => {
    setToken(null);
    setError(null);
    setLoading(false);
  };

  const transferQuestion = () => {
    question;
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
      return true;
    } catch (error) {
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getQuestion = async (usernameOrEmail) => {
    try{
      setError(null);
      setToken(null);
      setLoading(true);
      const {data} = await axios.post(`${BASE_URL}api/recover/securityquestion`, {
        usernameOrEmail
      }).then( res => {
        setQuestion(res.data);
      }
      )
      setToken(data);
      return true;
    }
    catch (error) {
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const recoverPassword = async (usernameOrEmail, answer) => {
    try {
      setError(null);
      setToken(null);
      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}api/recover/newpassword`, {
        usernameOrEmail,
        answer
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
    loading,
    error,
    getQuestion,
    recoverPassword,
    transferQuestion
  };

  return <Context.Provider value={authContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

export const useAuthContext = () => useContext(Context);
