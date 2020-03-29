import axios from "axios";
import { BASE_URL } from "./app/apiConfig";

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

export const validateName = async (name, setErrors, nameType) => {
  if (!validateRequired(name, setErrors, nameType)) return false;
  if (!validateLength(name, setErrors, nameType, 4, 40)) return false;
  const regExpr = /^[a-zA-Z\s]*$/;
  if (!regExpr.test(name)) {
    setErrors(prevState => ({
      ...prevState,
      email: "Only letters and spaces are allowed"
    }));
    return false;
    }
    setErrors(prevState => ({ ...prevState, [nameType]: null }));
    return true;
    };
export const validateCardNum = async (card, setErrors, nameType) => {
    if (!validateRequired(card, setErrors, nameType)) return false;
    if (!validateLength(card, setErrors, nameType, 16, 16)) return false;
    const regExpr = /^[0-9]*$/;
    if (!regExpr.test(card)) {
      setErrors(prevState => ({
        ...prevState,
        email: "Only numbers are allowed"
      }));
      return false;
      }
      setErrors(prevState => ({ ...prevState, [nameType]: null }));
      return true;
      };

  export const validateCvc = async (cvc, setErrors, nameType) => {
    if (!validateRequired(cvc, setErrors, nameType)) return false;
    if (!validateLength(cvc, setErrors, nameType, 3, 3)) return false;
    const regExpr = /^[0-9]*$/;
    if (!regExpr.test(cvc)) {
      setErrors(prevState => ({
        ...prevState,
        email: "Only numbers are allowed"
      }));
      return false;
      }
      setErrors(prevState => ({ ...prevState, [nameType]: null }));
      return true;
      };








export const validateForm = async (form, setErrors) => {
  let isValid = true;
  for (const key in form) {
    if (key === "cardNumber")
      isValid = validateCardNum(form[key], setErrors,key) && isValid;
    else if (key === "accountOwner")
      isValid = validateName(form[key], setErrors, key) && isValid;
    else if (key === "cvc")
      isValid = validateCvc(form[key], setErrors, key) && isValid;
    else isValid = validateRequired(form[key], setErrors, key) && isValid;
  }
  return isValid;
};
