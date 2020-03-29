import React, { useState } from "react";
import styles from "./styles";
import { InputItem, Icon, Button, Toast } from "@ant-design/react-native";
import ShowPasswordModal from "./showPasswordModal";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  ScrollView
} from "react-native";
import { validateRequired } from "../../helperFunctions";
import { useAuthContext } from "../../contexts/AuthContext";

const ForgotPassword = () => {
  const [isValid, setValid] = useState(false);
  const [enteredUser, setEnteredUser] = useState("");
  const [enteredAnswer, setEnteredAnswer] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const { recoverPassword, error, loading, getQuestion, transferQuestion } = useAuthContext();

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
    <Text style={styles.prompText}>{securityQuestion}+?</Text>
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
              loading={loading}
              disabled={loading}
              onPress={async () => {
              if (!secureAreaVisible) {
              const success = await getQuestion(enteredUser);
              if (!success) Toast.fail("Incorrect username or password", 0.8);
              else {
                setEnteredAnswer("");
                setEnteredUser("");
                setSecureAreaVisable(true);
                setSecurityQuestion(transferQuestion);
              }
              }
              else if (secureAreaVisible) {
              const success = await recoverPassword(enteredUser, enteredAnswer);
              if (!success) Toast.fail("Invalid recovery attempt", 0.8);
              else {
                
                setModalVisible(true);
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
