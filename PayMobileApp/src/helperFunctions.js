import axios from "axios";
import { BASE_URL } from "./app/apiConfig";
import { AsyncStorage } from "react-native";

export const validateRequired = (value, setErrors, field) => {
  if (!value || value === "") {
    setErrors(prevState => ({ ...prevState, [field]: "Field is required" }));
    return false;
  } else {
    setErrors(prevState => ({ ...prevState, [field]: null }));
    return true;
  }
};

export const validateLength = (
  value,
  setErrors,
  field,
  lowerBound,
  upperBound
) => {
  if (
    !value ||
    (upperBound && value.length > upperBound) ||
    (lowerBound && value.length < lowerBound)
  ) {
    setErrors(prevState => ({
      ...prevState,
      [field]: `Field requires ${lowerBound ? "min. " + lowerBound : null} & ${
        upperBound ? "max. " + upperBound : null
        } characters`
    }));
    return false;
  } else {
    setErrors(prevState => ({ ...prevState, [field]: null }));
    return true;
  }
};

export const validateName = (name, setErrors, nameType, setCheckIcons, nameOfCheckIcon) => {
  if (!validateRequired(name, setErrors, nameType)) {
    setCheckIcons((prevState) => ({
      ...prevState,
      [nameOfCheckIcon]: false
    }));
    return false;
  }
  if (!validateLength(name, setErrors, nameType, 3, 40)) {
    setCheckIcons((prevState) => ({
      ...prevState,
      [nameOfCheckIcon]: false
    }));
    return false;
  }
  setErrors(prevState => ({ ...prevState, [nameType]: null }));
  setCheckIcons((prevState) => ({
    ...prevState,
    [nameOfCheckIcon]: true
  }));
  return true;
};

export const validateEmail = async (email, setErrors, setCheckIcons) => {
  if (!validateRequired(email, setErrors, "email")) {
    setCheckIcons((prevState) => ({
      ...prevState,
      emailCheckIcon: false
    }));
    return false;
  }
  if (!validateLength(email, setErrors, "email", 0, 40)) {
    setCheckIcons((prevState) => ({
      ...prevState,
      emailCheckIcon: false
    }));
    return false;
  }
  const regExpr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regExpr.test(email)) {
    setErrors(prevState => ({
      ...prevState,
      email: "Email format not valid"
    }))
    setCheckIcons((prevState) => ({
      ...prevState,
      emailCheckIcon: false
    }));
    return false;
  }

  try {
    const { data } = await axios.get(
      `${BASE_URL}api/auth/user/checkEmailAvailability?email=${email}`
    );
    if (!data.available) {
      setErrors(prevState => ({
        ...prevState,
        email: "Email already exists"
      }));
      setCheckIcons((prevState) => ({
        ...prevState,
        emailCheckIcon: false
      }));
      return false;
    }
  } catch (error) {
    setErrors(prevState => ({
      ...prevState,
      email: "Could not verify email, try again"
    }));
  }
  setErrors(prevState => ({ ...prevState, email: null }));
  setCheckIcons((prevState) => ({
    ...prevState,
    emailCheckIcon: true
  }));
  return true;
};

export const validateUsername = async (username, setErrors, setCheckIcons) => {
  if (!validateRequired(username, setErrors, "username")) {
    setCheckIcons((prevState) => ({
      ...prevState,
      usernameCheckIcon: false
    }));
    return false;
  }
  if (!validateLength(username, setErrors, "username", 3, 15)) {
    setCheckIcons((prevState) => ({
      ...prevState,
      usernameCheckIcon: false
    }));
    return false;
  }
  try {
    const { data } = await axios.get(
      `${BASE_URL}api/auth/user/checkUsernameAvailability?username=${username}`
    );
    if (!data.available) {
      setErrors(prevState => ({
        ...prevState,
        username: "Username already exists"
      }));
      setCheckIcons((prevState) => ({
        ...prevState,
        usernameCheckIcon: false
      }));
      return false;
    }
  } catch (error) {
    setErrors(prevState => ({
      ...prevState,
      username: "Could not verify username, try again"
    }));
    setCheckIcons((prevState) => ({
      ...prevState,
      usernameCheckIcon: false
    }));
    return false;
  }

  setErrors(prevState => ({
    ...prevState,
    username: null
  }));
  setCheckIcons((prevState) => ({
    ...prevState,
    usernameCheckIcon: true
  }));
  return true;
};

export const validatePassword = (password, passwordConfirm, setErrors, setCheckIcons) => {
  if (!validateRequired(password, setErrors, "password")) {
    setCheckIcons((prevState) => ({
      ...prevState,
      passwordCheckIcon: false
    }));
    return false;
  }
  if (!validateLength(password, setErrors, "password", 6, 20)) {
    setCheckIcons((prevState) => ({
      ...prevState,
      passwordCheckIcon: false
    }));
    return false;
  }
  if (password !== passwordConfirm) {
    setErrors(prevState => ({
      ...prevState,
      passwordConfirm: "Passwords do not match"
    }));
    setCheckIcons((prevState) => ({
      ...prevState,
      passwordCheckIcon: false
    }));
    return false;
  }
  setErrors(prevState => ({ ...prevState, passwordConfirm: null }));
  setCheckIcons((prevState) => ({ ...prevState, passwordCheckIcon: true }));
  return true;
};

export const validateConfirmPassword = (
  password,
  passwordConfirm,
  setErrors,
  setCheckIcons
) => {
  if (!validateRequired(passwordConfirm, setErrors, "passwordConfirm")) {
    setCheckIcons((prevState) => ({
      ...prevState,
      passwordConfirmCheckIcon: false
    }));
    return false;
  }

  if (!validateLength(passwordConfirm, setErrors, "passwordConfirm", 6, 20)) {
    setCheckIcons((prevState) => ({
      ...prevState,
      passwordConfirmCheckIcon: false
    }));
    return false;
  }
  if (password !== passwordConfirm) {
    setErrors(prevState => ({
      ...prevState,
      passwordConfirm: "Passwords do not match"
    }));
    setCheckIcons((prevState) => ({
      ...prevState,
      passwordConfirmCheckIcon: false
    }));
    return false;
  }
  setErrors(prevState => ({ ...prevState, passwordConfirm: null }));
  setCheckIcons((prevState) => ({
    ...prevState,
    passwordConfirmCheckIcon: true
  }));
  return true;
};

export const validateForm = async (form, setErrors, setCheckIcons) => {
  let isValid = true;
  for (const key in form) {
    if (key === "email")
      isValid = (await validateEmail(form[key], setErrors, setCheckIcons)) && isValid;
    else if (key === "username")
      isValid = (await validateUsername(form[key], setErrors, setCheckIcons)) && isValid;
    else if (key === "firstName" || key === "lastName")
      isValid = validateName(form[key], setErrors, key, setCheckIcons) && isValid;
    else if (key === "password")
      isValid =
        validatePassword(form[key], form["passwordConfirm"], setErrors, setCheckIcons) &&
        isValid;

    else if (key === "oldPassword") {
      validateRequired(form[key], setErrors);
      validateLength(form[key], setErrors, "oldPassword", 4, 20);
    } else if (key === "passwordConfirm")
      isValid =
        validateConfirmPassword(form["password"], form[key], setErrors, setCheckIcons) &&
        isValid;
    else isValid = validateRequired(form[key], setErrors, key) && isValid;
  }
  return isValid;
};

export const getLatestUser = async () => {
  try {
    const username = await AsyncStorage.getItem("username");
    const password = await AsyncStorage.getItem("password");
    if (username && password) return { username, password };
  } catch (err) {
    console.log(err);
  }
  return false;
};

export const latestUserExists = async () => {
  return (await getLatestUser()) ? true : false;
};

export const updateLatestUser = async (username, password) => {
  try {
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("password", password);
  } catch (err) {
    console.log(err);
  }
};
