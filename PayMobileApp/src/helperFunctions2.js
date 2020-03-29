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
  setErrors(prevState => ({ ...prevState, [nameType]: null }));
  return true;
};

export const validateCardNum = async (card, setErrors, nameType) => {
    if (!validateRequired(card, setErrors, nameType)) return false;
    if (!validateLength(name, setErrors, nameType, 16, 16)) return false;
    setErrors(prevState => ({ ...prevState, [nameType]: null }));
    return true;
  };

  export const validateCvc = async (card, setErrors, nameType) => {
    if (!validateRequired(card, setErrors, nameType)) return false;
    if (!validateLength(name, setErrors, nameType, 3, 3)) return false;
    setErrors(prevState => ({ ...prevState, [nameType]: null }));
    return true;
  };








export const validateForm = async (form, setErrors) => {
  let isValid = true;
  for (const key in form) {
    if (key === "cardNumber")
      isValid = (await validateCardNum(form[key], setErrors)) && isValid;
    else if (key === "accountOwner")
      isValid = validateName(form[key], setErrors, key) && isValid;
    else if (key === "cvc")
      isValid = validateCvc(form[key], setErrors, key) && isValid;
    else isValid = validateRequired(form[key], setErrors, key) && isValid;
  }
  return isValid;
};
