import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import { Button } from "@ant-design/react-native";

const CheckoutInfo = ({ accountData, transactionData, onBackPressed }) => {
  const [items, setItems] = useState(transactionData.service.split(','));
  console.log(transactionData.service.split(','));

  
  function successToast() {
  
    Toast.success('Load success !!!', 1);
  }
  const submitPaymentBtn = () => {
    //salji serveru dio URADITI

    successToast;
  
  };



  return (
    <View style={styles.modal}>
      <View style={styles.innerContainer}>
        <Button
        onPress={onBackPressed}>
          Back</Button>
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

        <Button
          activeStyle={{ backgroundColor: "#030852" }}
          style={styles.button}
          type="primary"
          onPress={submitPaymentBtn}
        >Submit payment</Button>
      </View>
    </View>
  );
};

export default CheckoutInfo;
