import React, { useState } from "react";
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { List, Icon, Toast, Button, InputItem } from "@ant-design/react-native";
//import { validateForm, validateRequired, validatePassword, validateConfirmPassword } from "../../helperFunctions";
import axios from "axios";
//import { BASE_URL } from "../../app/apiConfig";
// ovo cu morat ukljuciti za server valjda...
import styles from "./styles.js";

// NEMA NIKAKVOG FAJLA TREBA OVO RAZDVOJIT POMOCNE FJE ITD AL PRVO DA PRORADI OVAKO PA JE LAKO SREDIT.

const UserProfile = () => {
  const [isLoading, setLoading] = useState(false);
  // const [enteredUser, setEnteredUser] = useState("");
  const [enteredAnswer, setEnteredAnswer] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    enteredAnswer: null,
    oldPassword: null,
    newPassword: null,
    confirmPassword: null
  });

  const getQuestion = async () => {

    validateConfirmPassword(newPassword, confirmPassword, setErrors);
    //setSecurityQuestion("nije ucitano pitanje NS");

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASE_URL}api/change/securityquestion`,
        {

        }
      );
      setSecurityQuestion(data.title);
      return true;
    } catch (error) {
      setErrors(prevState => ({
        ...prevState,
        //enteredUser: "Error has occured. Check your username and try again"

      }));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const validateRequired = (value, setErrors, field) => {
    if (!value || value === "") {
      setErrors(prevState => ({ ...prevState, [field]: "Field is required" }));
      return false;
    } else {
      setErrors(prevState => ({ ...prevState, [field]: null }));
      return true;
    }
  };

  const validateLength = (
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

  const validateConfirmPassword = (
    password,
    passwordConfirm,
    setErrors
  ) => {
    console.log(errors);
    /*console.log("PROVJERAVAM");
    console.log(password + " " + passwordConfirm);*/
    if (!validateRequired(passwordConfirm, setErrors, "confirmPassword"))
      return false;

    if (!validateLength(passwordConfirm, setErrors, "confirmPassword", 6, 20))
      return false;
    if (password !== passwordConfirm) {

      setErrors(prevState => ({
        ...prevState,
        confirmPassword: "Passwords do not match"
      }));
      return false;
    }
    setErrors(prevState => ({ ...prevState, confirmPassword: null }));
    return true;
  };



  const inputHandlerAnswer = text => {
    setEnteredAnswer(text);
    validateRequired(text, setErrors, "enteredAnswer");
  };

  const inputHandlerOldPassword = text => {
    setOldPassword(text);
    validateRequired(text, setErrors, "oldPassword");
  };

  const inputHandlerNewPassword = text => {
    setNewPassword(text);
    validateRequired(text, setErrors, "newPassword");
  };

  const inputHandlerConfirmPassword = text => {
    setConfirmPassword(text);
    validateRequired(text, setErrors, "confirmPassword");

  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View>
        <Text style={styles.prompText}>Pitanje: {securityQuestion ? securityQuestion : "nije ucitano"}</Text>
        <View style={styles.inputArea}>
          <List style={styles.list}>
            <InputItem
              style={styles.listItem}
              onChangeText={inputHandlerAnswer}
              value={enteredAnswer}
              error={errors.enteredAnswer}
              onErrorClick={() =>
                Toast.fail(
                  errors.enteredAnswer,
                  0.05 * errors.enteredAnswer.length
                )
              }
              style={styles.input}
              placeholder="Answer"
              extra={<Icon name="question-circle" />}
            />
          </List>
          <List style={styles.list}>
            <InputItem
              style={styles.listItem}
              onChangeText={inputHandlerOldPassword}
              value={oldPassword}
              error={errors.oldPassword}
              onErrorClick={() =>
                Toast.fail(
                  errors.oldPassword,
                  0.05 * errors.oldPassword.length
                )
              }
              style={styles.input}
              placeholder="Old password"
              extra={<Icon name="lock" />}
              type="password"
            />
          </List>
          <List style={styles.list}>
            <InputItem
              style={styles.listItem}
              onChangeText={inputHandlerNewPassword}
              value={newPassword}
              error={errors.newPassword}
              onErrorClick={() =>
                Toast.fail(
                  errors.newPassword,
                  0.05 * errors.newPassword.length
                )
              }
              style={styles.input}
              placeholder="New password"
              extra={<Icon name="lock" />}
              type="password"
            />
          </List>
          <List style={styles.list}>
            <InputItem
              style={styles.listItem}
              onChangeText={inputHandlerConfirmPassword}
              value={confirmPassword}
              error={errors.confirmPassword}

              onErrorClick={() =>
                Toast.fail(
                  errors.confirmPassword,
                  0.05 * errors.confirmPassword.length
                )
              }
              style={styles.input}
              placeholder="Repeat new password"
              extra={<Icon name="lock" />}
              type="password"
            />
          </List>
        </View>
        <View>
          <Button
            style={styles.button}
            activeStyle={{ backgroundColor: "#030852" }}
            loading={isLoading}
            disabled={isLoading}
            onPress={async () => {
              if (
                false && securityQuestion &&
                validateForm({ enteredAnswer, enteredUser }, setErrors)
              ) {
                //await recoverPassword(enteredUser, enteredAnswer);
              } else if (
                true
                //!securityQuestion && true
                // validateRequired(enteredUser, setErrors, "enteredUser")
              ) {
                await getQuestion();

              }
            }

            }
          >
            <Text style={styles.buttonText}>
              {!securityQuestion ? "GET YOUR QUESTION" : "CHANGE PASSWORD"}
            </Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView >
  );
};
export default UserProfile;
