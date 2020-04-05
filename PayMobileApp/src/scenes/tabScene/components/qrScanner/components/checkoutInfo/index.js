import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Button, List, Toast } from "@ant-design/react-native";
import { Actions } from "react-native-router-flux";
import axios from "axios";
import { BASE_URL } from "../../../../../../app/apiConfig";
import { useAuthContext } from "../../../../../../contexts/AuthContext";

const CheckoutInfo = ({
  accountData,
  transactionData,
  onBackPressed,
  setVisible,
}) => {
  const [items, setItems] = useState(transactionData.service.split(","));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useAuthContext();

  const testTransaction = async (bankAccountId, transactionId) => {
    try {
      console.log("AAAAAAAAA");
      setError(null);
      setLoading(true);
      const { data } = await axios.post(
        `${BASE_URL}/api/payments/checkbalance`,
        { bankAccountId, transactionId },
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`,
          },
        }
      );
      console.log("REZULTAT: ");
      console.log(data);
      onBackPressed();
      Toast.success("Successful payment!", 1);
      Actions.reset("tabScene");
    } catch (error) {
      if (error.message.includes("401")) {
        console.log(error);
        setError(error);
        onBackPressed();
        Toast.fail("You are unauthorized. Please log in", 1);
        // Actions.reset("userLogin");
      } else {
        setError(error);
        onBackPressed();
        Toast.fail("Error has occured. Please try again", 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.modal}>
      <View style={styles.subheader}>
        <Text style={styles.subtitle}>Payment summary</Text>
      </View>
      <View style={styles.additionalData}>
        <Text style={styles.additionalDataText}>{accountData.bankName}</Text>
        <Text style={styles.additionalDataText}>{accountData.cardNumber}</Text>
      </View>

      <ScrollView style={{ height: 300 }}>
        <List style={styles.list}>
          {items.map((item, index) => {
            return <List.Item key={index}>{item}</List.Item>;
          })}
        </List>
      </ScrollView>
      <View style={styles.additionalData}>
        <Text style={styles.additionalDataText}>Total amount:</Text>
        <Text style={styles.additionalDataText}>
          {transactionData.totalPrice.toFixed(2)} KM
        </Text>
      </View>

      <Button
        disabled={loading}
        activeStyle={{ backgroundColor: "#030852" }}
        style={styles.button}
        type="primary"
        onPress={async () => {
          console.log("PODACI");
          console.log(accountData.id + " " + transactionData.transactionId);
          await testTransaction(
            accountData.bankAccountId,
            transactionData.transactionId
          );
        }}
      >
        Submit payment
      </Button>
      <TouchableOpacity
        style={{
          ...styles.backButton,
        }}
        onPress={onBackPressed}
      >
        <Text
          style={{
            ...styles.backButtonText,
          }}
        >
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutInfo;
