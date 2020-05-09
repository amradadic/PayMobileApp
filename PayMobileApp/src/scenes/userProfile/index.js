import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { BASE_URL } from "../../app/apiConfig";
import {
  List,
  InputItem,
  Button,
  Toast,
  ActivityIndicator,
  Icon
} from "@ant-design/react-native";
import styles from "./styles";
import axios from "axios";
import {
  validateRequired,
  validatePassword,
  validateConfirmPassword,
  validateForm,
  validateLength
} from "../../helperFunctions";
import { Actions } from "react-native-router-flux";
import { useAuthContext } from "../../contexts/AuthContext";

const AddAccount = () => {
  const { token } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState(false);
  const [securityQuestion, setSequrityQuestion] = useState("");

  const [form, setForm] = useState({
    answer: "",
    oldPassword: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    answer: null,
    oldPassword: null,
    password: null,
    passwordConfirm: null
  });

  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);

  const [isCheckIconsVisible, setCheckIconsVisible] = useState(
    {
      passwordCheckIcon: null,
      passwordConfirmCheckIcon: null
    }
  );

  const sendNewPasswordRequest = async () => {
    try {
      const userAccountData = {
        answer: form.answer,
        oldPassword: form.oldPassword,
        newPassword: form.password
      };
      const { data } = await axios.post(
        `${BASE_URL}api/change/newpassword`,
        { ...userAccountData },
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }
      );
      if (!data.success) {
        Toast.fail("Error has occured. Please try again!", 1);
        setErrors((prevState) => ({ ...prevState, answer: data.message }))
      }
      else {
        Toast.success(data.message, 0.7);
        setTimeout(() => Actions.pop(), 700);
      }
    } catch (error) {
      if (error.message.includes("401"))
        setErrors((prevState) => ({ ...prevState, oldPassword: "Password is incorrect" }))
      Toast.fail("Error has occured. Please try again!", 1);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async () => {
    try {
      setQuestionError(null);
      setQuestionLoading(true);
      const response = await axios.get(`${BASE_URL}api/auth/user/me`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      });
      const { data } = await axios.post(
        `${BASE_URL}api/recover/securityquestion`,
        { usernameOrEmail: response.data.username },
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }
      );

      setSequrityQuestion(data.title);
    } catch (error) {
      if (error.message.includes("401")) {
        logOut();
        Actions.reset("userLogin");
      }
      setQuestionError(error);
    } finally {
      setQuestionLoading(false);
    }

    console.log(data);
  };

  useEffect(() => {
    loadQuestion();
  }, []);

  function showCheckIcon(isPasswordValid) {
    if (isNewPasswordValid != null && isNewPasswordValid == true) {
      const keyString = "someKey";
      return (
        <View style={styles.rowMemberIcon} key={keyString}>
          <Icon name="check-circle" color="#40EF6D" size="sm" />
        </View>
      );
    }
  }

  function showCheckIconConfirmPassword(validConfPass) {
    if (isConfirmPasswordValid != null && isConfirmPasswordValid == true) {
      const keyString = "someKey";
      return (
        <View style={styles.rowMemberIcon} key={keyString}>
          <Icon name="check-circle" color="#40EF6D" size="sm" />
        </View>
      );
    }
  }

  return (
    <ScrollView style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.title}>Change your password</Text>
      </View>
      {questionLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            paddingTop: 30
          }}
        >
          <ActivityIndicator size="large" color="#061178" />
        </View>
      ) : questionError ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", padding: 30 }}>
            Error has occured while loading
          </Text>
          <Button
            style={{ width: 120, alignSelf: "center" }}
            onPress={() => loadQuestion()}
          >
            Reload
          </Button>
        </View>
      ) : (
            <View style={styles.listView}>
              <List style={styles.list}>
                <InputItem
                  style={styles.listItem}
                  value={form.oldPassword}
                  error={errors.oldPassword}
                  onChange={value => {
                    validateRequired(value, setErrors);
                    validateLength(value, setErrors, "oldPassword", 4, 20)
                    setForm(prevState => ({ ...prevState, oldPassword: value }));
                  }}
                  onErrorClick={() =>
                    Toast.fail(errors.oldPassword, 0.05 * errors.oldPassword.length)
                  }
                  placeholder="Old password"
                  type="password"
                />
              </List>

              <View style={styles.row}>
                <View style={styles.rowMemberInput}>
                  <InputItem
                    style={styles.listItem}
                    value={form.password}
                    error={errors.password}
                    onChange={value => {
                      if (validatePassword(value, form.password, setErrors, setCheckIconsVisible) == true)
                        setIsNewPasswordValid(true);
                      else
                        setIsNewPasswordValid(false);

                      setForm(prevState => ({ ...prevState, password: value }));
                    }}
                    onErrorClick={() =>
                      Toast.fail(errors.password, 0.05 * errors.password.length)
                    }
                    placeholder="New password"
                    type="password"
                  />
                </View>
                {
                  showCheckIcon(isNewPasswordValid)
                }
              </View>

              <View style={styles.row}>
                <View style={styles.rowMemberInput}>
                  <InputItem
                    style={styles.listItem}
                    value={form.passwordConfirm}
                    error={errors.passwordConfirm}
                    onChange={value => {

                      if (validateConfirmPassword(form.password, value, setErrors, setCheckIconsVisible) == true)
                        setIsConfirmPasswordValid(true);
                      else
                        setIsConfirmPasswordValid(false);

                      setForm(prevState => ({
                        ...prevState,
                        passwordConfirm: value
                      }));
                    }}
                    onErrorClick={() =>
                      Toast.fail(
                        errors.passwordConfirm,
                        0.05 * errors.passwordConfirm.length
                      )
                    }
                    placeholder="Confirm new password"
                    type="password"
                  />
                </View>
                {
                  showCheckIconConfirmPassword(isConfirmPasswordValid)
                }
              </View>

              <Text style={styles.prompText}>{securityQuestion}</Text>
              <List style={styles.list}>
                <InputItem
                  style={styles.listItem}
                  value={form.answer}
                  error={errors.answer}
                  onChange={value => {
                    validateRequired(value, setErrors, "answer");
                    setForm(prevState => ({ ...prevState, answer: value }));
                  }}
                  onErrorClick={() =>
                    Toast.fail(errors.answer, 0.05 * errors.answer.length)
                  }
                  placeholder="Your answer"
                />
              </List>
              <Button
                loading={loading}
                disabled={loading}
                activeStyle={{ backgroundColor: "#030852" }}
                style={styles.button}
                type="primary"
                onPress={async () => {
                  setLoading(true);
                  const isValid = await validateForm(form, setErrors);
                  if (isValid) {
                    await sendNewPasswordRequest();
                  } else setLoading(false);
                }}
              >
                CHANGE PASSWORD
          </Button>
            </View>
          )}
    </ScrollView>
  );
};

export default AddAccount;
