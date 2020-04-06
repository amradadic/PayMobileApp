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
  onPaymentFinished,
  onBackPressed,
  setVisible,
  qrType,
}) => {
  const [items, setItems] = useState(transactionData.service.split(","));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useAuthContext();

  const submitPayment = async () => {
    try {
      setError(null);
      setLoading(true);
      const isOk = await testTransaction();
      if (!isOk) {
        onBackPressed();
        return;
      }

      if (qrType === "static") {
        const { data } = await axios.post(
          `${BASE_URL}api/payments/submit/static`,
          {
            bankAccountId: accountData.id,
            transactionId: transactionData.transactionId,
          },
          {
            headers: {
              authorization: `${token.tokenType} ${token.accessToken}`,
            },
          }
        );
        if (data.paymentStatus === "PAID") {
          Toast.success(data.message, 1);
          onPaymentFinished();
          Actions.reset("tabScene");
        } else if (data.paymentStatus === "PROBLEM") {
          Toast.fail(data.message, 1);
          onBackPressed();
        } else {
          onBackPressed();
          Toast.fail(data.message, 1);
        }
      } else if (qrType === "dynamic") {
        const { data } = await axios.post(
          `${BASE_URL}api/payments/submit/dynamic`,
          {
            receiptId: transactionData.receiptId,
            businessName: transactionData.businessName,
            service: transactionData.service,
            totalPrice: transactionData.totalPrice,
            bankAccountId: accountData.id,
          },
          {
            headers: {
              authorization: `${token.tokenType} ${token.accessToken}`,
            },
          }
        );

        if (data.paymentStatus === "PAID") {
          Toast.success(data.message, 1);
          onPaymentFinished();
        } else if (data.paymentStatus === "PROBLEM") {
          Toast.fail(data.message, 1);
          onBackPressed();
        } else {
          onBackPressed();
          Toast.fail(data.message, 1);
        }
      }
    } catch (error) {
      if (error.message.includes("401")) {
        setError(error);
        Toast.fail("You are unauthorized. Please log in", 1);
        Actions.reset("userLogin");
      } else {
        setError(error);
        onBackPressed();
        Toast.fail("Error has occured. Please try again", 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const testTransaction = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.post(
        `${BASE_URL}api/payments/checkbalance`,
        {
          bankAccountId: accountData.id,
          transactionId: transactionData.transactionId,
          totalPrice: transactionData.totalPrice,
        },
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`,
          },
        }
      );
      return true;
    } catch (error) {
      if (error.message.includes("401")) {
        setError(error);
        Toast.fail("You are unauthorized. Please log in", 1);
        Actions.reset("userLogin");
      } else {
        setError(error);
        Toast.fail("Error has occured. Please try again", 1);
      }
      return false;
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

      <ScrollView
        style={{
          height: 200,
          marginVertical: 20,
        }}
      >
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
        loading={loading}
        disabled={loading}
        activeStyle={{ backgroundColor: "#030852" }}
        style={styles.button}
        type="primary"
        onPress={async () => {
          await submitPayment();
        }}
      >
        Submit payment
      </Button>
      <TouchableOpacity
        style={{
          ...styles.backButton,
        }}
        onPress={onBackPressed}
        disabled={loading}
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
