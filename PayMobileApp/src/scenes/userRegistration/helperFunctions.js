export const validateRequired = (name, setErrors, field) => {
  if (!name || name === "") {
    setErrors(prevState => ({ ...prevState, [field]: "Polje je obavezno" }));
    return false;
  } else {
    setErrors(prevState => ({ ...prevState, [field]: null }));
    return true;
  }
};

export const validateEmail = (email, setErrors) => {
  if (!validateRequired(email, setErrors, "email")) return false;

  const regExpr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regExpr.test(email)) {
    setErrors(prevState => ({
      ...prevState,
      email: "Nije u ispravnom formatu"
    }));
    return false;
  }
  setErrors(prevState => ({ ...prevState, email: null }));
  return true;
};

export const validateUsername = (username, setErrors) => {
  if (!validateRequired(username, setErrors, "username")) return false;
};

export const validateForm = (form, setErrors) => {
  let isValid = true;
  Object.keys(form).forEach(key => {
    if (key === "email")
      isValid = validateEmail(form[key], setErrors) && isValid;
    else isValid = validateRequired(form[key], setErrors, key) && isValid;
  });
  if (!isValid) return isValid;
};
