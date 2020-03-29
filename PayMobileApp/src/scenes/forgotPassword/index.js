import React, { useState } from "react";
import styles from "./styles";
import { InputItem, Icon, Button, Toast, ActivityIndicator } from "@ant-design/react-native";
import ShowPasswordModal from "./showPasswordModal";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  ScrollView
} from "react-native";
import { validateRequired } from "../../helperFunctions";
import axios from "axios";
import { BASE_URL } from "../../app/apiConfig";

const ForgotPassword = () => {
  const [isValid, setValid] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [enteredUser, setEnteredUser] = useState("");
  const [error, setError] = useState(false);
  const [enteredAnswer, setEnteredAnswer] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    enteredAnswer: null,
    enteredUser: null
  });

  const [secureAreaVisible, setSecureAreaVisable] = useState(false);

  const [success, setSuccess] = useState(false);

  const inputHandlerUser = text => {
    setEnteredUser(text);
    setValid(validateRequired(text, setErrors, "enteredUser") && isValid);
  };

  const inputHandlerAnswer = text => {
    setEnteredAnswer(text);
    setValid(validateRequired(text, setErrors, "enteredAnswer") && isValid);
  };

  /*
  const confirmButton = () => {
    const help = secureAreaVisible;
    if (secureAreaVisible && success) {
    setValid(validateRequired(enteredUser, setErrors, "enteredUser"));
    setValid(
      validateRequired(enteredAnswer, setErrors, "enteredAnswer") && isValid
    );
    if (enteredUser === "Ja" && enteredAnswer === "Ja") {
      setEnteredAnswer("");
      setEnteredUser("");
      setModalVisible(true);
    }
  }
  else if (!secureAreaVisible) {
    setValid(validateRequired(enteredUser, setErrors, "enteredUser"));
    if (enteredUser === "Ja") {
      setEnteredAnswer("");
      setEnteredUser("");
      setSecureAreaVisable(true);
      setSuccess(true);
    }
  }
  };
  */

  let securePart;
  let buttonText;

  if (!secureAreaVisible) {
    buttonText = "GET QUESTION";
  }
  else if (secureAreaVisible) {
    buttonText = "RECOVER";
  }

    if (secureAreaVisible) {
      securePart = <View>
      <Text style={styles.prompText}>Answer the security question below.</Text>
    <Text style={styles.prompText}>{securityQuestion}</Text>
      <View style={styles.inputArea}>
        <InputItem
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
          extra={<Icon name="lock" />}
        />
      </View>
      </View>
    }



    const getQuestion = async (usernameOrEmail) => {
      try{
        setError(null);
        setLoading(true);
        const {data} = await axios.post(`${BASE_URL}api/recover/securityquestion`, {
          usernameOrEmail
        });
        console.log(data);
        setSecurityQuestion(data.title);
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
        setLoading(true);
        const { data } = await axios.post(`${BASE_URL}api/recover/newpassword`, {
          usernameOrEmail,
          answer
        });
        setPassword(data);
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    };




  return (
    <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ShowPasswordModal
        isVisible={isModalVisible}
        setVisible={setModalVisible}
        message="Password recovered"
      />
      <ScrollView style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>Forgot your password?</Text>
        </View>

        <View style={styles.subsection}>
          <Text style={styles.prompText}>
            Please enter your username or email.
          </Text>
          <View style={styles.inputArea}>
            <InputItem
              onChangeText={inputHandlerUser}
              value={enteredUser}
              style={styles.input}
              error={errors.enteredUser}
              onErrorClick={() =>
                Toast.fail(errors.enteredUser, 0.05 * errors.enteredUser.length)
              }
              placeholder="Username or Email"
              extra={<Icon name="user" />}
            />
          </View>
          {securePart}        
          <View>
            <Button
              style={styles.button}
              activeStyle={{ backgroundColor: "#030852" }}
              loading={isLoading}
              disabled={isLoading}
              onPress={async () => {
              if (!secureAreaVisible) {
              const success = await getQuestion(enteredUser);
              if (!success) { 
                Toast.fail("Incorrect username or email", 0.8);
                setEnteredAnswer("");
                setEnteredUser("");
            }
              else {
                setEnteredAnswer("");
                setEnteredUser("");
                setSecureAreaVisable(true);
                setLoading(false);
                setError(false);
              }
              }
              else if (secureAreaVisible) {
              const recovery = await recoverPassword(enteredUser, enteredAnswer);
              if (!recovery) { 
                Toast.fail("Invalid input", 0.8);
                setEnteredAnswer("");
                setEnteredUser("");
            }
              else {
                setModalVisible(true);
                console.log({password});
                console.log("USPJEH");
              }
              }
            }}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
