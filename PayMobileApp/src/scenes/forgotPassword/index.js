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

const ForgotPassword = () => {
  const [isValid, setValid] = useState(false);
  const [enteredUser, setEnteredUser] = useState("");
  const [enteredAnswer, setEnteredAnswer] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const [errors, setErrors] = useState({
    enteredAnswer: null,
    enteredUser: null
  });

  const inputHandlerUser = text => {
    setEnteredUser(text);
    setValid(validateRequired(text, setErrors, "enteredUser") && isValid);
  };

  const inputHandlerAnswer = text => {
    setEnteredAnswer(text);
    setValid(validateRequired(text, setErrors, "enteredAnswer") && isValid);
  };

  const confirmButton = () => {
    setValid(validateRequired(enteredUser, setErrors, "enteredUser"));
    setValid(
      validateRequired(enteredAnswer, setErrors, "enteredAnswer") && isValid
    );
    if (enteredUser === "ja" && enteredAnswer === "ja") {
      setEnteredAnswer("");
      setEnteredUser("");
      setModalVisible(true);
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

          <Text style={styles.prompText}>Answer your security question.</Text>
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

          <View>
            <Button
              style={styles.button}
              activeStyle={{ backgroundColor: "#030852" }}
              onPress={confirmButton}
            >
              <Text style={styles.buttonText}>RECOVER</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
