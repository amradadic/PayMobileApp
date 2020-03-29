import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import {
  List,
  InputItem,
  Button,
  Toast,
  DatePicker
} from "@ant-design/react-native";
import styles from "./styles";
import { validateRequired, validateForm } from "../../helperFunctions";

const AddAccount = () => {
  const [form, setForm] = useState({
    cardNumber: null,
    expirationDate: new Date(),
    cvc: null,
    accountOwner: ""
  });

  const [errors, setErrors] = useState({
    cardNumber: null,
    expirationDate: "asdas",
    cvc: null,
    accountOwner: null
  });

  return (
    <ScrollView style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.title}>Add new account</Text>
      </View>

      <View style={styles.listView}>
        <List style={styles.list}>
          <InputItem
            style={styles.listItem}
            value={form.cardNumber}
            error={errors.cardNumber}
            onChange={value => {
              validateRequired(value, setErrors, "cardNumber");
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
            minDate={new Date()}
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
              validateRequired(value, setErrors, "cvc");
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
          <InputItem
            style={styles.listItem}
            error={errors.accountOwner}
            value={form.accountOwner}
            onChange={value => {
              validateRequired(value, setErrors, "accountOwner");
              setForm(prevState => ({ ...prevState, accountOwner: value }));
            }}
            onErrorClick={() =>
              Toast.fail(errors.accountOwner, 0.05 * errors.accountOwner.length)
            }
            placeholder="Account owner"
          />
        </List>
        <Button
          activeStyle={{ backgroundColor: "#030852" }}
          style={styles.button}
          type="primary"
          onPress={() => {
            validateForm(form, setErrors);
          }}
        >
          ADD ACCOUNT
        </Button>
      </View>
    </ScrollView>
  );
};

export default AddAccount;
