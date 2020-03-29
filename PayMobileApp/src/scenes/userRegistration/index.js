import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { Button } from "@ant-design/react-native";
import HelpModal from "./components/helpModal";
import styles from "./styles";
import { validateForm } from "../../helperFunctions";
import PersonalData from "./components/personalData";
import SecurityQuestion from "./components/securityQuestion";

const UserRegistration = () => {
  const [isLoading, setLoading] = useState(false);
  const [isQuestionHelpVisible, setQuestionHelpVisible] = useState(false);
  const [isPasswordHelpVisible, setPasswordHelpVisible] = useState(false);
  const [isEmailHelpVisible, setEmailHelpVisible] = useState(false);
  const [isUsernameHelpVisible, setUsernameHelpVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [form, setForm] = useState({
    firstName: null,
    lastName: null,
    email: null,
    username: null,
    password: null,
    passwordConfirm: null,
    answer: null
  });

  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    username: null,
    password: null,
    passwordConfirm: null,
    answer: null
  });

  const [questions] = useState([
    { title: "Some random question?", id: 1 },
    { title: "Another random question?", id: 2 }
  ]);

  return (
    <ScrollView style={styles.body}>
      <HelpModal
        setVisible={setPasswordHelpVisible}
        isVisible={isPasswordHelpVisible}
        message={"Confirm your password by entering it twice."}
      />
      <HelpModal
        setVisible={setQuestionHelpVisible}
        isVisible={isQuestionHelpVisible}
        message={
          "You will be prompted to answer this question in case you forget your password."
        }
      />
      <HelpModal
        setVisible={setUsernameHelpVisible}
        isVisible={isUsernameHelpVisible}
        message={"Choose your username."}
      />
      <HelpModal
        setVisible={setEmailHelpVisible}
        isVisible={isEmailHelpVisible}
        message={"Choose your email. Example:\nexample@example.com"}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Sign up</Text>
      </View>

      <View style={styles.listView}>
        <PersonalData
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
          setUsernameHelpVisible={setUsernameHelpVisible}
          setEmailHelpVisible={setEmailHelpVisible}
          setPasswordHelpVisible={setPasswordHelpVisible}
        />
        <SecurityQuestion
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
          setSelectedQuestion={setSelectedQuestion}
          selectedQuestion={selectedQuestion}
          setQuestionHelpVisible={setQuestionHelpVisible}
          questions={questions}
        />
        <Button
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
          type="primary"
          onPress={() => {
            setLoading(true);
            validateForm(form, setErrors);
            setLoading(false);
          }}
        >
          SIGN UP
        </Button>
      </View>
    </ScrollView>
  );
};

export default UserRegistration;
