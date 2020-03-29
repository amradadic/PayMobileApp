import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { Button, ActivityIndicator, Toast } from "@ant-design/react-native";
import HelpModal from "./components/helpModal";
import styles from "./styles";
import { validateForm } from "../../helperFunctions";
import PersonalData from "./components/personalData";
import SecurityQuestion from "./components/securityQuestion";
import axios from "axios";
import { BASE_URL } from "../../app/apiConfig";

const UserRegistration = () => {
  const [signingUp, setSigningUp] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isQuestionHelpVisible, setQuestionHelpVisible] = useState(false);
  const [isPasswordHelpVisible, setPasswordHelpVisible] = useState(false);
  const [isEmailHelpVisible, setEmailHelpVisible] = useState(false);
  const [isUsernameHelpVisible, setUsernameHelpVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);

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

  const loadQuestions = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}questions`);
      setQuestions(data);
      if (data.length > 0) setSelectedQuestion(data[0].id);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const signUserUp = async () => {
    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      username: form.username,
      password: form.password,
      answer: {
        text: form.answer
      }
    };

    try {
      const { data } = await axios.post(
        `${BASE_URL}api/auth/signup/${selectedQuestion}`,
        {
          ...userData
        }
      );
      console.log(data)
      if (!data.success) {
        Toast.fail(`Failed to sign up. ${data.message}`);
      } else {
        Toast.success("Sign up completed successfuly!", 0.7);
        setTimeout(() => Actions.reset("userLogin"), 700);
      }
    } catch (error) {
      Toast.fail("Failed to sign up, please try again");
    } finally {
      setSigningUp(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <ActivityIndicator size="large" color="#061178" />
        </View>
      ) : error ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", padding: 30 }}>
            Error has occured while loading
          </Text>
          <Button
            style={{ width: 120, alignSelf: "center" }}
            onPress={() => Actions.refresh()}
          >
            Reload
          </Button>
        </View>
      ) : (
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
              activeStyle={{ backgroundColor: "#030852" }}
              loading={signingUp}
              disabled={signingUp}
              style={styles.button}
              type="primary"
              onPress={async () => {
                setSigningUp(true);
                const isValid = await validateForm(form, setErrors);
                if (isValid) {
                  await signUserUp();
                } else setSigningUp(false);
              }}
            >
              SIGN UP
            </Button>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default UserRegistration;
