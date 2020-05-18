export const validateRequired = (value, setErrors, field) => {
  if (!value || value === "") {
    setErrors(prevState => ({ ...prevState, [field]: "Field is required" }));
    return false;
  }
  else {
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

export const validateName = (accountOwner, setErrors) => {
  if (!validateRequired(accountOwner, setErrors, "accountOwner")) return false;
  if (!validateLength(accountOwner, setErrors, "accountOwner", 4, 40)) return false;
  const regExpr = /^[a-zA-Z\u0100-\u017f\s]*$/;
  if (!regExpr.test(accountOwner)) {
    setErrors(prevState => ({
      ...prevState,
      accountOwner: "Only letters and spaces are allowed"
    }));
    return false;
  }
  setErrors(prevState => ({ ...prevState, accountOwner: null }));
  return true;
};

export const validateCardNumber = (cardNumber, setErrors) => {
  if (!validateRequired(cardNumber, setErrors, "cardNumber")) return false;
  if (!validateLength(cardNumber, setErrors, "cardNumber", 16, 16)) return false;
  const regExpr = /^[0-9]*$/;
  if (!regExpr.test(cardNumber)) {
    setErrors(prevState => ({
      ...prevState,
      cardNumber: "Only numbers are allowed"
    }));
    return false;
  }
  setErrors(prevState => ({ ...prevState, cardNumber: null }));
  return true;
};

export const validateCvc = (cvc, setErrors) => {
  if (!validateRequired(cvc, setErrors, "cvc")) return false;
  if (!validateLength(cvc, setErrors, "cvc", 3, 3)) return false;
  const regExpr = /^[0-9]*$/;
  if (!regExpr.test(cvc)) {
    setErrors(prevState => ({
      ...prevState,
      cvc: "Only numbers are allowed"
    }));
    return false;
  }
  setErrors(prevState => ({ ...prevState, cvc: null }));
  return true;
};

export const validateForm = (form, setErrors) => {
  let isValid = true;
  for (const key in form) {
    if (key === "cardNumber")
      isValid = validateCardNumber(form[key], setErrors) && isValid;
    else if (key === "accountOwner")
      isValid = validateName(form[key], setErrors) && isValid;
    else if (key === "cvc")
      isValid = validateCvc(form[key], setErrors) && isValid;
    else isValid = validateRequired(form[key], setErrors, key) && isValid;
  }
  return isValid;
};

export const validateNumber = (insertedValue, setErrors, setCheckIcons, typeOfField) => {
  let checkIconFieldName = typeOfField + "CheckIcon";
  const regExpr = /^[0-9]*$/;

  if (checkIconFieldName == "transactionAmountLimitCheckIcon") {

    if (!validateRequired(insertedValue, setErrors, "transactionAmountLimit")) {
      setCheckIcons((prevState) => ({
        ...prevState,
        transactionAmountLimitCheckIcon: false
      }));
      return false;
    }
    if (!validateLength(insertedValue, setErrors, "transactionAmountLimit", 1, 100)) {
      setCheckIcons((prevState) => ({
        ...prevState,
        transactionAmountLimitCheckIcon: false
      }));
      return false;
    }
    if (!regExpr.test(insertedValue)) {
      setCheckIcons((prevState) => ({
        ...prevState,
        transactionAmountLimitCheckIcon: false
      }));

      setErrors(prevState => ({
        ...prevState,
        transactionAmountLimit: "Input is not in the right format"
      }));
      return false;
    }

    setCheckIcons((prevState) => ({
      ...prevState,
      transactionAmountLimitCheckIcon: true
    }));

    setErrors(prevState => ({
      ...prevState,
      transactionAmountLimit: null
    }));

    return true;
  }
  else if (checkIconFieldName == "monthlyLimitCheckIcon") {

    if (!validateRequired(insertedValue, setErrors, "monthlyLimit")) {
      setCheckIcons((prevState) => ({
        ...prevState,
        monthlyLimitCheckIcon: false
      }));
      return false;
    }
    if (!validateLength(insertedValue, setErrors, "monthlyLimit", 1, 100)) {
      setCheckIcons((prevState) => ({
        ...prevState,
        monthlyLimitCheckIcon: false
      }));
      return false;
    }
    if (!regExpr.test(insertedValue)) {
      setCheckIcons((prevState) => ({
        ...prevState,
        monthlyLimitCheckIcon: false
      }));
      setErrors(prevState => ({
        ...prevState,
        monthlyLimit: "Input is not in the right format"
      }));
      return false;
    }

    setCheckIcons((prevState) => ({
      ...prevState,
      monthlyLimitCheckIcon: true
    }));

    setErrors(prevState => ({
      ...prevState,
      monthlyLimit: null
    }));

    return true;
  }
  else if (checkIconFieldName == "balanceLowerLimitCheckIcon") {

    if (!validateRequired(insertedValue, setErrors, "balanceLowerLimit")) {
      setCheckIcons((prevState) => ({
        ...prevState,
        balanceLowerLimitCheckIcon: false
      }));
      return false;
    }
    if (!validateLength(insertedValue, setErrors, "balanceLowerLimit", 1, 100)) {
      setCheckIcons((prevState) => ({
        ...prevState,
        balanceLowerLimitCheckIcon: false
      }));
      return false;
    }
    if (!regExpr.test(insertedValue)) {
      setCheckIcons((prevState) => ({
        ...prevState,
        balanceLowerLimitCheckIcon: false
      }));
      setErrors(prevState => ({
        ...prevState,
        balanceLowerLimit: "Input is not in the right format"
      }));
      return false;
    }

    setCheckIcons((prevState) => ({
      ...prevState,
      balanceLowerLimitCheckIcon: true
    }));
    setErrors(prevState => ({
      ...prevState,
      balanceLowerLimit: null
    }));

    return true;
  }

  return false;
};
