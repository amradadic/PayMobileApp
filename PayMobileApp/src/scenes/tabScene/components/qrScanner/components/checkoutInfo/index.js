import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import styles from "./styles";
import { Button, Toast, Modal } from "@ant-design/react-native";
import { Actions } from "react-native-router-flux";
import axios from "axios";
import { BASE_URL } from "../../../../../../app/apiConfig";
import { useAuthContext } from "../../../../../../contexts/AuthContext";

const CheckoutInfo = ({ accountData, transactionData, onBackPressed }) => {
  const [items, setItems] = useState(transactionData.service.split(','));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useAuthContext();

  
  function successToast() {
  
    //Toast.success('Load success !!!', 1);
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Cancel",
          onPress: () => {onBackPressed()},
          style: "cancel"
        }
      ]
    );
  }

  
  const submitPaymentBtn = () => {
    //salji serveru dio URADITI

    successToast;
  
  };


  const testTransaction = async (bankAccountId, transactionId) => {
    try {
      console.log("AAAAAAAAA");
      setError(null);
      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}/api/payments/checkbalance`,{bankAccountId, transactionId},
      {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`,
        },
      });
      console.log("REZULTAT: ");
      console.log(data);
      Actions.reset("tabScene");
    } catch (error) {
      if (error.message.includes("401")) {
        console.log(error);
        successToast();
      }
      setError(error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <View style={styles.modal}>
      <View style={styles.innerContainer}>
        <Button
        onPress={onBackPressed}
        activeStyle={{ backgroundColor: "#030852" }}
          style={styles.button}
          type="primary"
          >
          Back</Button>
        <Text style={styles.item2}>Chosen card: {accountData.bankName} </Text>
        <ScrollView>
          {
            items.map((item) =>{
              return(
                <View>
                  <Text style={styles.item}>{item}</Text>
                </View>
              )
            }

            )
          }
        </ScrollView>
        <Text style={styles.item2}>Total amount: {transactionData.totalPrice} </Text>

        <Button
        disabled={loading}
          activeStyle={{ backgroundColor: "#030852" }}
          style={styles.button}
          type="primary"
          onPress={async () => {
            console.log("PODACI");
            console.log(accountData.id + " " + transactionData.transactionId);
            await testTransaction(accountData.bankAccountId, transactionData.transactionId);
          }}
        >Submit payment</Button>
      </View>
    </View>
  );
};

export default CheckoutInfo;
