export const validateRequired = (name, setErrors, field) => {
  if (!name || name === "") {
    setErrors(prevState => ({ ...prevState, [field]: "Polje je obavezno" }));
    return false;
  } else {
    setErrors(prevState => ({ ...prevState, [field]: null }));
    return true;
  }
};

export const validateForm = (form, setErrors) => {
  let isValid = true;
  Object.keys(form).forEach(key => {
    isValid = validateRequired(form[key], setErrors, key) && isValid;
  });
  if (!isValid) return isValid;
};
