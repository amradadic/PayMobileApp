import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { BASE_URL } from "../../app/apiConfig";
import {
  List,
  InputItem,
  Button,
  Toast,
  DatePicker,
  ActivityIndicator
} from "@ant-design/react-native";
import styles from "./styles";
import axios from "axios";
import {
  validateRequired,
  validateForm,
  validateCardNumber,
  validateCvc,
} from "../../helperFunctions2";
import { Actions } from "react-native-router-flux";
import { useAuthContext } from "../../contexts/AuthContext";

const AddAccount = () => {
  const { token } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(false);

  const [form, setForm] = useState({
    cardNumber: null,
    expirationDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    ),
    cvc: null,
    accountOwner: ""
  });

  const [errors, setErrors] = useState({
    cardNumber: null,
    expirationDate: null,
    cvc: null,
    accountOwner: null
  });
  const sendAccountRequest = async () => {
    try {
      const accountData = {
        accountOwner: form.accountOwner,
        bankName: "bank",
        expiryDate: `${form.expirationDate.getDate()}.${form.expirationDate.getMonth() +
          1}.${form.expirationDate.getFullYear()}`,
        cvc: form.cvc.toString(),
        cardNumber: form.cardNumber.toString()
      };
      const { data } = await axios.post(
        `${BASE_URL}api/accounts/add`,
        { ...accountData },
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }
      );
      if (!data.success) Toast.fail(data.text, 1);
      else {
        Toast.fail("Successfully added new account!", 0.7);
        setTimeout(() => Actions.pop(), 700);
      }
    } catch (error) {
      if (error.message.includes("404"))
        Toast.fail("Bank account does not exist", 1);
      else
        Toast.fail("Failed to add account. Check your inputs and try again", 1);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      setUserError(null);
      setUserLoading(true);
      const { data } = await axios.get(`${BASE_URL}api/auth/user/me`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      });
      setForm(prevState => ({
        ...prevState,
        accountOwner: data.firstName + " " + data.lastName
      }));
    } catch (error) {
      setUserError(error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <ScrollView style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.title}>Add new account</Text>
      </View>
      {userLoading ? (
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
      ) : userError ? (
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
        <View style={styles.listView}>
          <List style={styles.list}>
            <InputItem
              style={styles.listItem}
              value={form.cardNumber}
              error={errors.cardNumber}
              onChange={value => {
                validateCardNumber(value, setErrors);
                setForm(prevState => ({ ...prevState, cardNumber: value }));
              }}
              onErrorClick={() =>
                Toast.fail(errors.cardNumber, 0.05 * errors.cardNumber.length)
              }
              type="number"
              placeholder="Card number"
            />
          </List>
          <List style={styles.list}>
            <DatePicker
              minDate={
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
              }
              maxDate={new Date(new Date().getFullYear() + 10, 1)}
              mode="month"
              value={form.expirationDate}
              style={styles.listItem}
              onChange={value => {
                validateRequired(value, setErrors, "expirationDate");
                setForm(prevState => ({ ...prevState, expirationDate: value }));
              }}
              extra={" "}
              format="YYYY-MM-DD"
              locale={{ okText: "Confirm", dismissText: "Cancel" }}
            >
              <List.Item>
                <Text style={styles.datePickerText}>Expiration date</Text>
              </List.Item>
            </DatePicker>
          </List>
          <List style={styles.list}>
            <InputItem
              style={styles.listItem}
              value={form.cvc}
              error={errors.cvc}
              onChange={value => {
                validateCvc(value, setErrors);
                setForm(prevState => ({ ...prevState, cvc: value }));
              }}
              onErrorClick={() =>
                Toast.fail(errors.cvc, 0.05 * errors.cvc.length)
              }
              placeholder="CVC"
              type="number"
            />
          </List>
          <List style={styles.list}>
            <Text style={{ ...styles.listItem, ...styles.user }}>
              {form.accountOwner}
            </Text>
          </List>
          <Button
            loading={loading}
            disabled={loading}
            activeStyle={{ backgroundColor: "#030852" }}
            style={styles.button}
            type="primary"
            onPress={async () => {
              setLoading(true);
              const isValid = validateForm(form, setErrors);
              if (isValid) {
                await sendAccountRequest();
              } else setLoading(false);
            }}
          >
            ADD ACCOUNT
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default AddAccount;
