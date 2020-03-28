export const validateRequired = (name, setErrors, field) => {
  if (!name || name === "") {
    setErrors(prevState => ({ ...prevState, [field]: "Polje je obavezno" }));
    return false;
  } else {
    setErrors(prevState => ({ ...prevState, [field]: null }));
    return true;
  }
};
