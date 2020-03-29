import React, { useState } from "react";
import styles from "./styles";
import {
  InputItem,
  Icon,
  Button,
  Toast,
  ActivityIndicator
} from "@ant-design/react-native";
import ShowPasswordModal from "./showPasswordModal";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  ScrollView
} from "react-native";
import { validateRequired, validateForm } from "../../helperFunctions";
import axios from "axios";
import { BASE_URL } from "../../app/apiConfig";

const ForgotPassword = () => {
  const [isLoading, setLoading] = useState(false);
  const [enteredUser, setEnteredUser] = useState("");
  const [enteredAnswer, setEnteredAnswer] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState(null);
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    enteredAnswer: null,
    enteredUser: null
  });

  const inputHandlerUser = text => {
    setEnteredUser(text);
    validateRequired(text, setErrors, "enteredUser");
  };

  const inputHandlerAnswer = text => {
    setEnteredAnswer(text);
    validateRequired(text, setErrors, "enteredAnswer");
  };

  const getQuestion = async usernameOrEmail => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASE_URL}api/recover/securityquestion`,
        {
          usernameOrEmail
        }
      );
      setSecurityQuestion(data.title);
      return true;
    } catch (error) {
      setErrors(prevState => ({
        ...prevState,
        enteredUser: "Error has occured. Check your username and try again"
      }));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const recoverPassword = async (usernameOrEmail, answer) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}api/recover/newpassword`, {
        usernameOrEmail,
        answer
      });
      setPassword(data.password);
      setModalVisible(true);
      return true;
    } catch (error) {
      setErrors(prevState => ({
        ...prevState,
        enteredAnswer: "Your answer does not match your username"
      }));
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
        message="Password recovered! Your new password:"
        password={password}
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
              disabled={!!securityQuestion}
              onErrorClick={() =>
                Toast.fail(errors.enteredUser, 0.05 * errors.enteredUser.length)
              }
              placeholder="Username or Email"
              extra={<Icon name="user" />}
            />
          </View>
          {securityQuestion ? (
            <View>
              <Text style={styles.prompText}>
                Answer the security question below.
              </Text>
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
                  extra={<Icon name="question-circle" />}
                />
              </View>
            </View>
          ) : null}

          <View>
            <Button
              style={styles.button}
              activeStyle={{ backgroundColor: "#030852" }}
              loading={isLoading}
              disabled={isLoading}
              onPress={async () => {
                if (
                  securityQuestion &&
                  validateForm({ enteredAnswer, enteredUser }, setErrors)
                ) {
                  await recoverPassword(enteredUser, enteredAnswer);
                } else if (
                  !securityQuestion &&
                  validateRequired(enteredUser, setErrors, "enteredUser")
                ) {
                  await getQuestion(enteredUser);
                }
              }}
            >
              <Text style={styles.buttonText}>
                {!securityQuestion ? "GET YOUR QUESTION" : "RECOVER PASSWORD"}
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
